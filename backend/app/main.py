"""KineticMesh FastAPI Application: Autonomous Decision Intelligence Engine."""
import logging
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional

from app.core.config import settings
from app.schemas.decision import InvestigationRequest, DecisionResponse
from app.agents.orchestrator import OrchestratorAgent
from app.agents.researcher import ResearcherAgent
from app.agents.verifier import VerifierAgent
from app.agents.decision_maker import DecisionMakerAgent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("KineticMesh")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Autonomous decision intelligence engine coordinating multi-agent research, verification, and synthesis with Google Search grounding.",
    version="2.5.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware configuration - strict origin validation
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize 4-Agent Pipeline
orchestrator = OrchestratorAgent(model_name=settings.GEMINI_MODEL)
researcher = ResearcherAgent(model_name=settings.GEMINI_MODEL)
verifier = VerifierAgent(model_name=settings.GEMINI_MODEL)
decision_maker = DecisionMakerAgent(model_name=settings.GEMINI_MODEL)

@app.get("/health", tags=["Telemetry"])
@app.get("/api/health", tags=["Telemetry"])
async def health_check():
    """Returns platform operational readiness and configuration status."""
    has_key = bool(settings.GEMINI_API_KEY)
    return {
        "status": "healthy",
        "service": "KineticMesh Decision Engine",
        "version": "2.5.0",
        "gemini_model": settings.GEMINI_MODEL,
        "gemini_configured": has_key,
        "agents": ["Orchestrator", "Researcher", "Verifier", "DecisionMaker"],
        "grounding": "Google Search Grounding",
    }

@app.post(
    "/api/v1/investigate",
    response_model=DecisionResponse,
    tags=["Investigation"],
    status_code=status.HTTP_200_OK,
)
async def run_investigation(request: InvestigationRequest):
    """Executes the complete 4-agent consensus pipeline with dynamic verification loop."""
    query = request.query.strip()
    if not query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inquiry query string cannot be empty."
        )

    if len(query) > 2500:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inquiry exceeds maximum allowed length of 2500 characters."
        )

    logger.info(f"[KineticMesh Pipeline] Initiating investigation: '{query[:80]}...'")

    try:
        # Phase 1: ORCHESTRATOR
        plan = await orchestrator.plan(query)
        logger.info(f"[Orchestrator] Decomposed into {len(plan.research_tasks)} empirical vectors")

        # Phase 2: RESEARCHER
        claims = []
        for task in plan.research_tasks[:3]:
            task_claims = await researcher.execute_task(task)
            claims.extend(task_claims)
        logger.info(f"[Researcher] Retrieved {len(claims)} discrete grounded claims")

        # Phase 3: VERIFIER
        iterations = 1
        verified_claims, needs_followup = await verifier.verify(claims)

        # Dynamic Verification Feedback Loop
        max_iter = min(request.max_iterations or 2, settings.MAX_ITERATIONS)
        while needs_followup and iterations < max_iter:
            iterations += 1
            logger.info(f"[Verifier Feedback Loop] Pass {iterations}: Resolving data gaps / conflicts")
            followup_task = plan.research_tasks[-1]
            followup_task.search_query = f"{query} empirical verification confirmation data"
            extra_claims = await researcher.execute_task(followup_task)
            claims.extend(extra_claims)
            verified_claims, needs_followup = await verifier.verify(claims)

        # Phase 4: DECISION MAKER
        decision = await decision_maker.synthesize(
            query=query,
            evidence=verified_claims,
            iterations_run=iterations
        )
        logger.info(f"[Decision Maker] Synthesis complete: {decision.investigation_id} (Confidence: {decision.confidence_score})")
        return decision

    except Exception as exc:
        logger.error(f"[KineticMesh] Pipeline execution failure: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Multi-agent deliberation pipeline encountered an unexpected error."
        )
