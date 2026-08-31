from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.schemas.decision import DecisionRequest, DecisionResponse, GroundedClaim, ClaimSource, HealthResponse
import uuid
from datetime import datetime

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        timestamp=datetime.utcnow()
    )

@app.post(f"{settings.API_V1_STR}/investigate", response_model=DecisionResponse)
async def mock_investigate(request: DecisionRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query payload cannot be empty.")

    mock_evidence = [
        GroundedClaim(
            id="CLM-001",
            claim_text="Commercial solar PV installations reduce average daytime grid import costs by 40-55%.",
            sources=[
                ClaimSource(
                    title="Iberian Energy Market Review 2024",
                    url="https://example.org/energy-report-2024",
                    snippet="Industrial consumers saw an average grid reduction of 48% following PV adoption."
                )
            ],
            verification_status="Verified",
            verification_note="Corroborated across utility metering data."
        ),
        GroundedClaim(
            id="CLM-002",
            claim_text="Full capital expenditure payback is achieved in under 4.0 years under current export tariffs.",
            sources=[
                ClaimSource(
                    title="Solar Installer Marketing Deck",
                    url="https://example.org/vendor-solar-quote",
                    snippet="Rapid amortization under historical fixed feed-in rates."
                ),
                ClaimSource(
                    title="National Grid Export Analysis",
                    url="https://example.org/grid-export-2025",
                    snippet="Wholesale solar export value drops significantly during peak summer mid-day production."
                )
            ],
            verification_status="Conflicting",
            verification_note="Vendor assumes peak rates; actual grid compensation reflects wholesale indexing."
        )
    ]

    return DecisionResponse(
        query_id=str(uuid.uuid4()),
        original_query=request.query,
        recommendation="CONDITIONAL APPROVAL: Proceed with commercial solar installation only if paired with battery storage (minimum 45% capacity).",
        confidence_score=0.78,
        primary_reasons=[
            "Daytime on-site load offset yields defensible 48% reduction in grid power imports.",
            "Standalone grid export revenues are declining due to mid-day solar saturation.",
            "Battery storage captures high evening wholesale arbitrage value."
        ],
        evidence_items=mock_evidence,
        risks=[
            "Regulatory volatility regarding industrial battery storage incentives.",
            "Battery storage degradation costs over an 8-year operational horizon."
        ],
        assumptions=[
            "Facility operates weekday shifts between 08:00 and 18:00 CET.",
            "Existing roof structural load can support standard commercial racking."
        ],
        next_steps=[
            "Request interval power load data (15-minute resolution) from utility provider.",
            "Obtain quotes specifying battery systems with minimum 10-year / 6,000-cycle warranties.",
            "Model return on investment using hourly spot-price indexing."
        ]
    )