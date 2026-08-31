from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.schemas.decision import DecisionRequest, DecisionResponse, HealthResponse
from app.agents.orchestrator import OrchestratorAgent
from app.agents.researcher import ResearcherAgent
from app.agents.verifier import VerifierAgent
from app.agents.decision_maker import DecisionMakerAgent
from datetime import datetime

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = OrchestratorAgent()
researcher = ResearcherAgent()
verifier = VerifierAgent()
decision_maker = DecisionMakerAgent()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        timestamp=datetime.utcnow()
    )

@app.post(f"{settings.API_V1_STR}/investigate", response_model=DecisionResponse)
async def run_investigation(request: DecisionRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    tasks = await orchestrator.plan(request.query)

    collected_claims = []
    for task in tasks:
        claims = await researcher.research_task(task)
        collected_claims.extend(claims)

    verified_claims = await verifier.verify_claims(collected_claims)
    decision = await decision_maker.decide(request.query, verified_claims)
    return decision