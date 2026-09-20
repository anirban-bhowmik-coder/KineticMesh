from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class ClaimSource(BaseModel):
    title: str = Field(..., description="Document or website title")
    url: str = Field(..., description="URL or reference citation")
    snippet: Optional[str] = Field(None, description="Relevant excerpt or ground snippet")

class GroundedClaim(BaseModel):
    id: str = Field(..., description="Unique claim identifier, e.g. CLM-01")
    claim_text: str = Field(..., description="The empirical claim or factual assertion")
    sources: List[ClaimSource] = Field(default_factory=list, description="Grounding source citations")
    verification_status: Literal["Verified", "Conflicting", "Uncertain", "Unsupported"] = Field(
        ..., description="Verification verdict"
    )
    verification_note: str = Field(..., description="Justification or cross-check notes")

class ResearchTask(BaseModel):
    task_id: str = Field(..., description="e.g. TASK-01")
    focus_area: str = Field(..., description="Target dimension, e.g. Economic or Regulatory")
    search_query: str = Field(..., description="Grounding search query string")

class OrchestratorPlan(BaseModel):
    objective: str = Field(..., description="Core decision objective")
    constraints: List[str] = Field(default_factory=list, description="Identified boundary conditions")
    research_tasks: List[ResearchTask] = Field(default_factory=list, description="Planned research tasks")

class InvestigationRequest(BaseModel):
    query: str = Field(..., min_length=5, max_length=2500, description="Strategic decision objective to investigate")
    max_iterations: Optional[int] = Field(default=2, ge=1, le=3, description="Bounded verification feedback passes")

class DecisionResponse(BaseModel):
    investigation_id: str = Field(..., description="Unique audit identifier")
    original_query: str = Field(..., description="Original user inquiry")
    recommendation: str = Field(..., description="Defended strategic stance")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Model-assessed confidence metric")
    model_assessed_confidence: float = Field(..., ge=0.0, le=1.0, description="Explicit label for model confidence")
    primary_reasons: List[str] = Field(default_factory=list, description="Core justification premises")
    facts: List[str] = Field(default_factory=list, description="Corroborated empirical facts")
    inferences: List[str] = Field(default_factory=list, description="Logical deductions")
    uncertainties: List[str] = Field(default_factory=list, description="Data gaps and unresolved variables")
    evidence_items: List[GroundedClaim] = Field(default_factory=list, description="Grounded claim docket")
    risks: List[str] = Field(default_factory=list, description="Identified risk factors")
    assumptions: List[str] = Field(default_factory=list, description="Underlying premises and boundary conditions")
    next_steps: List[str] = Field(default_factory=list, description="Actionable execution sequence")
    iterations_run: int = Field(default=1, description="Number of feedback loop iterations completed")
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat(), description="ISO timestamp")
