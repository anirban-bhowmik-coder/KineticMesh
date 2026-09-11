import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.schemas.decision import DecisionRequest, DecisionResponse, HealthResponse
from app.agents.orchestrator import OrchestratorAgent
from app.agents.researcher import ResearcherAgent
from app.agents.verifier import VerifierAgent
from app.agents.decision_maker import DecisionMakerAgent

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("kiro.pipeline")

app = FastAPI(title=settings.PROJECT_NAME)

# Permissive CORS setup for local testing across localhost and 192.168.x.x
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = OrchestratorAgent()
researcher = ResearcherAgent()
verifier = VerifierAgent()
decision_maker = DecisionMakerAgent()

MAX_RESEARCH_ITERATIONS = 2

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        gemini_configured=bool(settings.GEMINI_API_KEY),
        timestamp=datetime.utcnow()
    )

@app.post(f"{settings.API_V1_STR}/investigate", response_model=DecisionResponse)
async def run_investigation(request: DecisionRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Inquiry cannot be empty.")

    logger.info(f"Starting investigation for query: {request.query}")
    iteration = 1

    try:
        # Agent 1: Orchestrator plans research tasks
        plan = await orchestrator.plan(request.query)
        logger.info(f"Orchestrator generated {len(plan.research_tasks)} tasks")

        # Agent 2: Researcher retrieves grounded evidence
        all_claims = []
        for task in plan.research_tasks:
            result = await researcher.research(task)
            all_claims.extend(result.extracted_claims)

        # Agent 3: Verifier checks claims
        verification = await verifier.verify(all_claims)
        verified_claims = verification.verified_claims

        # Dynamic feedback loop
        while verification.needs_more_research and iteration < MAX_RESEARCH_ITERATIONS:
            iteration += 1
            focus = verification.clarification_focus or "resolving conflicting metrics"
            logger.info(f"Feedback loop triggered (Iteration {iteration}): {focus}")
            
            clarification_task = await orchestrator.create_clarification_task(request.query, focus)
            clarification_result = await researcher.research(clarification_task)
            
            if clarification_result.extracted_claims:
                re_verify = await verifier.verify(clarification_result.extracted_claims)
                verified_claims.extend(re_verify.verified_claims)
                verification = re_verify
            else:
                break

        # Agent 4: Decision Maker formulates recommendation
        decision = await decision_maker.decide(
            original_query=request.query,
            verified_evidence=verified_claims,
            iterations_run=iteration
        )
        logger.info(f"Deliberation complete: {decision.investigation_id}")
        return decision

    except Exception as e:
        logger.error(f"Pipeline error during investigation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Deliberation pipeline failed: {str(e)}")