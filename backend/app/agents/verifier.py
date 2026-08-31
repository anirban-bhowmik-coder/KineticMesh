import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.decision import GroundedClaim

class VerifierAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def verify_claims(self, claims: list[GroundedClaim]) -> list[GroundedClaim]:
        if not self.client:
            return claims

        prompt = f"""
        You are the Verifier Agent. Fact check and cross-examine these evidence items:
        {json.dumps([c.model_dump() for c in claims], indent=2)}

        For each claim assign status: "Verified", "Conflicting", "Uncertain", or "Unsupported".
        Return ONLY a JSON array matching GroundedClaim.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.0)
            )
            raw = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw)
            return [GroundedClaim(**item) for item in data]
        except Exception:
            return claims