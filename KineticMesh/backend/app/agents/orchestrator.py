import json
import re
import logging
from google import genai
from google.genai import types
from app.core.config import settings
from app.core.gemini import call_gemini_with_fallback
from app.schemas.decision import OrchestratorPlan, ResearchTask

logger = logging.getLogger("kineticmesh.orchestrator")

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
        match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except Exception:
                pass
    return None

class OrchestratorAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def plan(self, user_query: str) -> OrchestratorPlan:
        if not self.client:
            raise ValueError("GEMINI_API_KEY is not configured in backend/.env")

        prompt = f"""
        You are the Orchestrator Agent for KINETICMESH.
        Decompose this decision inquiry into exactly 3 targeted research tasks:
        USER QUERY: "{user_query}"

        Return a JSON object:
        {{
          "objective": "Concise statement of the decision goal",
          "constraints": ["Key constraint or scope parameter"],
          "research_tasks": [
            {{"task_id": "TASK-1", "focus_area": "Economic & Financial Factors", "search_query": "{user_query} costs financial return"}},
            {{"task_id": "TASK-2", "focus_area": "Regulatory & Market Standards", "search_query": "{user_query} regulations benchmarks"}},
            {{"task_id": "TASK-3", "focus_area": "Operational & Technical Feasibility", "search_query": "{user_query} operational risks degradation"}}
          ]
        }}
        """
        try:
            response = call_gemini_with_fallback(
                client=self.client,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            data = extract_json(response.text)
            if data and "research_tasks" in data:
                return OrchestratorPlan(**data)
            raise ValueError("Malformed orchestrator output")
        except Exception as e:
            logger.warning(f"Orchestrator fallback applied: {e}")
            return OrchestratorPlan(
                objective=user_query,
                constraints=["Default scope"],
                research_tasks=[
                    ResearchTask(task_id="TASK-1", focus_area="Economic Impact", search_query=f"{user_query} financial viability costs"),
                    ResearchTask(task_id="TASK-2", focus_area="Standards & Policies", search_query=f"{user_query} regulatory policies benchmarks"),
                    ResearchTask(task_id="TASK-3", focus_area="Feasibility Risks", search_query=f"{user_query} operational risks failure rate")
                ]
            )

    async def create_clarification_task(self, original_query: str, clarification_focus: str) -> ResearchTask:
        return ResearchTask(
            task_id="TASK-CLARIFY",
            focus_area="Evidence Conflict Resolution",
            search_query=f"{original_query} {clarification_focus}"
        )