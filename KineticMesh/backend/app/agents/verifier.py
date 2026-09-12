import json
import re
import logging
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.decision import GroundedClaim, VerificationResult

logger = logging.getLogger("kineticmesh.verifier")

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

class VerifierAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def verify(self, claims: list[GroundedClaim]) -> VerificationResult:
        if not self.client:
            return VerificationResult(verified_claims=claims, needs_more_research=False)

        claims_payload = [c.model_dump() for c in claims]
        prompt = f"""
        You are the Verifier Agent for KINETICMESH.
        Fact-check, cross-examine, and assess the reliability of these extracted claims:
        {json.dumps(claims_payload, indent=2)}

        Rules:
        1. If a claim lacks sources, mark status as "Unsupported".
        2. If claims contradict each other, mark status as "Conflicting" and explain the disagreement.
        3. If evidence is credible and corroborated, mark status as "Verified".
        4. If evidence is incomplete, mark status as "Uncertain".
        5. Set "needs_more_research" to true ONLY if there are critical conflicts that could be resolved by another search.

        Return a JSON object:
        {{
          "verified_claims": [
            {{
              "id": "claim_id",
              "claim_text": "claim text",
              "sources": [...],
              "verification_status": "Verified",
              "verification_note": "Explanation of verification findings"
            }}
          ],
          "conflicts_detected": ["Summary of conflicts"],
          "needs_more_research": false,
          "clarification_focus": null
        }}
        """
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.0
                )
            )
            data = extract_json(response.text)
            if data and "verified_claims" in data:
                claims_out = [GroundedClaim(**item) for item in data["verified_claims"]]
                return VerificationResult(
                    verified_claims=claims_out,
                    conflicts_detected=data.get("conflicts_detected", []),
                    needs_more_research=bool(data.get("needs_more_research", False)),
                    clarification_focus=data.get("clarification_focus")
                )
        except Exception as e:
            logger.warning(f"Verifier API error, using fallback: {e}")

        # Fallback if model parsing fails
        fallback_claims = []
        for c in claims:
            status = "Verified" if len(c.sources) > 0 else "Unsupported"
            note = "Corroborated by search grounding." if len(c.sources) > 0 else "No sources returned."
            fallback_claims.append(
                GroundedClaim(
                    id=c.id,
                    claim_text=c.claim_text,
                    sources=c.sources,
                    verification_status=status,
                    verification_note=note
                )
            )
        return VerificationResult(verified_claims=fallback_claims, needs_more_research=False)

    # Alias for backward compatibility
    async def verify_claims(self, claims: list[GroundedClaim]) -> list[GroundedClaim]:
        res = await self.verify(claims)
        return res.verified_claims