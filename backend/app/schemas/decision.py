from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime

class ClaimSource(BaseModel):
    title: str = Field(..., description="Title of the source webpage or publication")
    url: str = Field(..., description="Direct URL returned by search grounding")
    snippet: Optional[str] = Field(None, description="Direct relevant excerpt if available")

class GroundedClaim(BaseModel):
    id: str = Field(..., description="Unique stable claim identifier (e.g., CLM-101)")
    claim_text: str = Field(..., description="Atomic empirical statement")
    sources: List[ClaimSource] = Field(default_factory=list, description="Grounding sources")
    verification_status: Literal["Verified", "Conflicting", "Uncertain", "Unsupported"] = "Uncertain"
    verification_note: str = Field("", description="Verifier findings and contradiction notes")

class ResearchTask(BaseModel):
    task_id: str
    focus_area: str
    search_query: str

class OrchestratorPlan(BaseModel):
    objective: str
    constraints: List[str] = Field(default_factory=list)
    research_tasks: List[ResearchTask]

class ResearchResult(BaseModel):
    task_id: str
    search_query: str
    extracted_claims: List[GroundedClaim]
    raw_sources_found: List[ClaimSource]

class VerificationResult(BaseModel):
    verified_claims: List[GroundedClaim]
    conflicts_detected: List[str] = Field(default_factory=list)
    needs_more_research: bool = False
    clarification_focus: Optional[str] = None

class DecisionRequest(BaseModel):
    query: str = Field(..., min_length=5, max_length=1000, description="The user inquiry")

class DecisionResponse(BaseModel):
    investigation_id: str
    original_query: str
    recommendation: str
    model_assessed_confidence: float = Field(..., ge=0.0, le=1.0)
    primary_reasons: List[str]
    facts: List[str] = Field(default_factory=list, description="Directly supported by verified evidence")
    inferences: List[str] = Field(default_factory=list, description="Logical deductions derived from evidence")
    uncertainties: List[str] = Field(default_factory=list, description="Unresolved variables or data gaps")
    evidence_items: List[GroundedClaim]
    risks: List[str]
    assumptions: List[str]
    next_steps: List[str]
    iterations_run: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HealthResponse(BaseModel):
    status: str
    project: str
    gemini_configured: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow)