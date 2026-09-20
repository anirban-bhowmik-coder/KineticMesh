"""FastAPI API Unit and Integration Tests for KineticMesh."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Verify system health endpoint returns correct schema and agent list."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "agents" in data
    assert len(data["agents"]) == 4
    assert "Orchestrator" in data["agents"]

def test_investigation_empty_query():
    """Verify empty query returns 400 or 422 Bad Request."""
    response = client.post("/api/v1/investigate", json={"query": "   "})
    assert response.status_code in [400, 422]

def test_investigation_oversized_query():
    """Verify oversized query exceeding 2500 characters is rejected."""
    long_query = "A" * 3000
    response = client.post("/api/v1/investigate", json={"query": long_query})
    assert response.status_code in [400, 422]

def test_investigation_valid_schema():
    """Verify valid query returns all required decision response fields."""
    payload = {
        "query": "Should an enterprise adopt confidential computing for financial audit processing?",
        "max_iterations": 2
    }
    response = client.post("/api/v1/investigate", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "investigation_id" in data
    assert "recommendation" in data
    assert "confidence_score" in data
    assert "primary_reasons" in data
    assert "facts" in data
    assert "inferences" in data
    assert "uncertainties" in data
    assert "evidence_items" in data
    assert "risks" in data
    assert "assumptions" in data
    assert "next_steps" in data
    assert isinstance(data["evidence_items"], list)
