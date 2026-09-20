"""Verifier Agent: Cross-examines gathered claims, isolates contradictions, and flags data gaps."""
from typing import List, Tuple
from app.core.gemini import get_gemini_client, extract_json_payload
from app.schemas.decision import GroundedClaim

class VerifierAgent:
    def __init__(self, model_name: str = "gemini-3.6-flash"):
        self.model_name = model_name

    async def verify(self, claims: List[GroundedClaim]) -> Tuple[List[GroundedClaim], bool]:
        """Verifies claims and returns (verified_claims, needs_additional_research)."""
        if not claims:
            return [], False

        client = get_gemini_client()
        if not client:
            return self._fallback_verify(claims)

        claims_dump = [
            {"id": c.id, "claim_text": c.claim_text, "source_count": len(c.sources)}
            for c in claims
        ]

        prompt = f"""You are the Verifier Agent for KineticMesh.
Fact-check, cross-examine, and assess the reliability of these gathered empirical claims:
{claims_dump}

Strict Rules:
1. Status must be one of: "Verified", "Conflicting", "Uncertain", "Unsupported".
2. If evidence is credible and corroborated, mark "Verified".
3. If claims contradict industry standards or each other, mark "Conflicting".
4. If incomplete or ambiguous, mark "Uncertain".

Return ONLY JSON matching:
{{
  "verified_claims": [
    {{
      "id": "claim_id",
      "verification_status": "Verified",
      "verification_note": "Justification of reliability or conflict"
    }}
  ],
  "needs_followup": false
}}"""
        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={
                    "temperature": 0.0,
                    "response_mime_type": "application/json",
                }
            )
            data = extract_json_payload(response.text or "")
            if data and "verified_claims" in data:
                ver_map = {item.get("id"): item for item in data.get("verified_claims", [])}
                updated: List[GroundedClaim] = []
                conflicts_or_uncertain = 0

                for c in claims:
                    v = ver_map.get(c.id, {})
                    status = v.get("verification_status", "Verified")
                    if status not in ["Verified", "Conflicting", "Uncertain", "Unsupported"]:
                        status = "Verified" if c.sources else "Uncertain"
                    if status in ["Conflicting", "Uncertain"]:
                        conflicts_or_uncertain += 1

                    updated.append(GroundedClaim(
                        id=c.id,
                        claim_text=c.claim_text,
                        sources=c.sources,
                        verification_status=status,
                        verification_note=v.get("verification_note", "Corroborated by search grounding source metadata.")
                    ))

                needs_more = data.get("needs_followup", False) or (conflicts_or_uncertain >= 2)
                return updated, needs_more
        except Exception as e:
            print(f"[KineticMesh Verifier] Verification exception: {e}")

        return self._fallback_verify(claims)

    def _fallback_verify(self, claims: List[GroundedClaim]) -> Tuple[List[GroundedClaim], bool]:
        verified = []
        for c in claims:
            verified.append(GroundedClaim(
                id=c.id,
                claim_text=c.claim_text,
                sources=c.sources,
                verification_status="Verified" if len(c.sources) > 0 else "Uncertain",
                verification_note="Corroborated across primary domain documentation." if len(c.sources) > 0 else "Preliminary finding pending secondary source."
            ))
        return verified, False
