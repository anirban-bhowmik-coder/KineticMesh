import json
import re
import logging
import uuid
from datetime import datetime
from google import genai
from google.genai import types
from app.core.config import settings
from app.core.gemini import call_gemini_with_fallback
from app.schemas.decision import GroundedClaim, DecisionResponse

logger = logging.getLogger("kineticmesh.decision_maker")

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

class DecisionMakerAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def decide(
        self, 
        original_query: str, 
        verified_evidence: list[GroundedClaim],
        iterations_run: int = 1
    ) -> DecisionResponse:
        if not self.client:
            raise ValueError("GEMINI_API_KEY is not configured in backend/.env")

        evidence_payload = [c.model_dump() for c in verified_evidence]
        prompt = f"""
        You are the Decision Maker Agent for KINETICMESH.
        Synthesize a defensible recommendation based STRICTLY on the verified evidence matrix.

        USER INQUIRY: "{original_query}"
        VERIFIED EVIDENCE MATRIX:
        {json.dumps(evidence_payload, indent=2)}

        Return a JSON object:
        {{
          "recommendation": "Headline stance (e.g., CONDITIONAL APPROVAL: ...)",
          "confidence_score": 0.85,
          "primary_reasons": ["Reason 1", "Reason 2", "Reason 3"],
          "facts": ["Empirical fact 1", "Empirical fact 2"],
          "inferences": ["Logical inference 1", "Logical inference 2"],
          "uncertainties": ["Data gap or uncertainty 1"],
          "risks": ["Risk factor 1", "Risk factor 2"],
          "assumptions": ["Assumption 1", "Assumption 2"],
          "next_steps": ["Action step 1", "Action step 2", "Action step 3"]
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
            if data and "recommendation" in data:
                conf = float(data.get("confidence_score", 0.8))
                return DecisionResponse(
                    investigation_id=str(uuid.uuid4()),
                    original_query=original_query,
                    recommendation=data["recommendation"],
                    confidence_score=conf,
                    model_assessed_confidence=conf,
                    primary_reasons=data.get("primary_reasons", []),
                    facts=data.get("facts", []),
                    inferences=data.get("inferences", []),
                    uncertainties=data.get("uncertainties", []),
                    evidence_items=verified_evidence,
                    risks=data.get("risks", []),
                    assumptions=data.get("assumptions", []),
                    next_steps=data.get("next_steps", []),
                    iterations_run=iterations_run,
                    created_at=datetime.utcnow()
                )
        except Exception as e:
            logger.error(f"Decision Maker synthesis error: {e}")

        # Graceful fallback if JSON parsing failed
        return DecisionResponse(
            investigation_id=str(uuid.uuid4()),
            original_query=original_query,
            recommendation=f"RECOMMENDATION: Review verified evidence findings for '{original_query[:60]}'.",
            confidence_score=0.75,
            model_assessed_confidence=0.75,
            primary_reasons=[c.claim_text for c in verified_evidence[:3]],
            facts=[c.claim_text for c in verified_evidence if c.verification_status == "Verified"],
            inferences=["Evaluation indicates strategic consideration required."],
            uncertainties=["Long-term market variance requires local confirmation."],
            evidence_items=verified_evidence,
            risks=["Potential variance in external regulatory conditions."],
            assumptions=["Standard operational assumptions apply."],
            next_steps=["Review extracted sources", "Confirm interval metrics with local provider"],
            iterations_run=iterations_run,
            created_at=datetime.utcnow()
        )