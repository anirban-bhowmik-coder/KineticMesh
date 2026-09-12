import json
import re
import logging
from google import genai
from google.genai import types
from app.core.config import settings
from app.core.gemini import call_gemini_with_fallback
from app.schemas.decision import ResearchTask, ResearchResult, GroundedClaim, ClaimSource

logger = logging.getLogger("kineticmesh.researcher")

def extract_json(text: str):
    if not text:
        return None
    cleaned = text.strip()
    if "```" in cleaned:
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE)
    cleaned = cleaned.strip()
    try:
        return json.loads(cleaned)
    except Exception:
        match = re.search(r"(\[.*\]|\{.*\})", cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except Exception:
                pass
    return None

class ResearcherAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def research(self, task: ResearchTask) -> ResearchResult:
        if not self.client:
            raise ValueError("GEMINI_API_KEY is not configured in backend/.env")

        prompt = f"""
        You are the Researcher Agent of KINETICMESH. 
        Use the Google Search tool to find concrete, empirical facts for this inquiry.
        
        Focus Area: {task.focus_area}
        Search Query: "{task.search_query}"

        Extract 1 to 3 atomic factual findings from search results.
        Do NOT give recommendations or qualitative advice.
        
        Output MUST be a raw JSON array matching this format:
        [
          {{
            "id": "{task.task_id}-C1",
            "claim_text": "Direct empirical finding from the search results"
          }}
        ]
        """
        try:
            response = call_gemini_with_fallback(
                client=self.client,
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[{"google_search": {}}],
                    temperature=0.1
                )
            )

            extracted_sources = []
            if response.candidates and len(response.candidates) > 0:
                candidate = response.candidates[0]
                metadata = getattr(candidate, "grounding_metadata", None)
                if metadata:
                    chunks = getattr(metadata, "grounding_chunks", None) or []
                    for chunk in chunks:
                        web = getattr(chunk, "web", None)
                        if web:
                            uri = getattr(web, "uri", "") or ""
                            title = getattr(web, "title", "Verified Web Source") or "Verified Web Source"
                            if uri:
                                extracted_sources.append(ClaimSource(title=title, url=uri, snippet=None))

            parsed = extract_json(response.text)
            claims = []
            
            if isinstance(parsed, list):
                for idx, item in enumerate(parsed):
                    if isinstance(item, dict) and "claim_text" in item:
                        claims.append(
                            GroundedClaim(
                                id=item.get("id", f"{task.task_id}-C{idx+1}"),
                                claim_text=item["claim_text"],
                                sources=extracted_sources,
                                verification_status="Uncertain",
                                verification_note="Grounded via live web search; pending Verifier review."
                            )
                        )

            if not claims and response.text:
                clean_summary = re.sub(r"[#*`]", "", response.text).strip()[:250]
                claims.append(
                    GroundedClaim(
                        id=f"{task.task_id}-C1",
                        claim_text=clean_summary,
                        sources=extracted_sources,
                        verification_status="Uncertain",
                        verification_note="Extracted from search grounding output."
                    )
                )

            return ResearchResult(
                task_id=task.task_id,
                search_query=task.search_query,
                extracted_claims=claims,
                raw_sources_found=extracted_sources
            )

        except Exception as e:
            logger.error(f"Search grounding failed for task {task.task_id}: {e}")
            return ResearchResult(
                task_id=task.task_id,
                search_query=task.search_query,
                extracted_claims=[
                    GroundedClaim(
                        id=f"{task.task_id}-ERR",
                        claim_text=f"Live search grounding could not retrieve corroboration for: {task.search_query}",
                        sources=[],
                        verification_status="Unsupported",
                        verification_note="Search request returned zero grounded sources or failed."
                    )
                ],
                raw_sources_found=[]
            )

    async def research_task(self, task: ResearchTask, user_query: str = "") -> list[GroundedClaim]:
        res = await self.research(task)
        return res.extracted_claims