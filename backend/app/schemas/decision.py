from pydantic import BaseModel, Field
from typing import List, Literal
from datetime import datetime

class ClaimSource(BaseModel):
    title: str
    url: str
    snippet: str

class GroundedClaim(BaseModel):
    id: str
    claim_text: str
    sources: List[ClaimSource] = []
    verification_status: Literal["Verified", "Conflicting", "Uncertain", "Unsupported"]
    verification_note: str

class ResearchTask(BaseModel):
    task_id: str
    focus_area: str
    search_query: str

class DecisionRequest(BaseModel):
    query: str = Field(..., min_length=5, max_length=1000)

class DecisionResponse(BaseModel):
    query_id: str
    original_query: str
    recommendation: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    primary_reasons: List[str]
    evidence_items: List[GroundedClaim]
    risks: List[str]
    assumptions: List[str]
    next_steps: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HealthResponse(BaseModel):
    status: str
    project: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)