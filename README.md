<div align="center">

# 🧠 KINETICMESH
### Autonomous Decision Intelligence Engine

**"Think through the decision. Don't just answer it."**

[![System Status](https://img.shields.io/badge/STATUS-PRODUCTION--READY-06b6d4?style=for-the-badge)](https://github.com/anirban-bhowmik-coder/KineticMesh)
[![Model](https://img.shields.io/badge/MODEL-GEMINI%202.5%20FLASH-3b82f6?style=for-the-badge)](https://deepmind.google/technologies/gemini/)
[![Grounding](https://img.shields.io/badge/GROUNDING-GOOGLE%20SEARCH-10b981?style=for-the-badge)](https://cloud.google.com)
[![License](https://img.shields.io/badge/LICENSE-MIT-8b5cf6?style=for-the-badge)](LICENSE)

*Architected & Built by **Anirban Bhowmik***

</div>

---

## 📑 TABLE OF CONTENTS
- [🎯 The Vision](#-the-vision)
- [⚠️ The Problem: The Single-Turn LLM Failure Mode](#️-the-problem-the-single-turn-llm-failure-mode)
- [💡 The Solution: Multi-Agent Consensus Graph](#-the-solution-multi-agent-consensus-graph)
- [🏛️ System Architecture & Dynamic Feedback Loop](#️-system-architecture--dynamic-feedback-loop)
- [🔬 The Four Specialized Agents](#-the-four-specialized-agents)
- [⚖️ Epistemic Rigor: Facts, Inferences & Uncertainties](#️-epistemic-rigor-facts-inferences--uncertainties)
- [🚀 Quality Gate & Hackathon Checklist](#-quality-gate--hackathon-checklist)
- [⚡ Quick Start & Installation](#-quick-start--installation)
- [📡 API Documentation](#-api-documentation)
- [🧪 Automated Test Suite](#-automated-test-suite)
- [🔒 Security & Hardening Audit](#-security--hardening-audit)
- [🤖 Transparent AI-Use Declaration](#-transparent-ai-use-declaration)
- [🎙️ Two-Minute Pitch Script](#️-two-minute-pitch-script)

---

## 🎯 THE VISION

> **"Think through the decision. Don't just answer it."**

In enterprise strategy, technology infrastructure, and capital deployment, high-stakes decisions cannot be made using hasty, single-turn LLM prompts. A single-turn model generates a persuasive narrative without checking contradictions, without citing empirical data, and without separating verified facts from speculative assumptions.

**KineticMesh** transforms decision-making into an auditable, multi-agent deliberation graph. It decomposes inquiries, retrieves search-grounded evidence, stress-tests claims through cross-verification, triggers dynamic feedback loops when contradictions appear, and synthesizes defended decisions with explicit uncertainty envelopes.

---

## ⚠️ THE PROBLEM: THE SINGLE-TURN LLM FAILURE MODE

| Failure Mode | Single-Turn Chatbot | KineticMesh Decision Intelligence |
|---|---|---|
| **Factuality** | Hallucinates plausible citations and statistics | Live Google Search grounding with verifiable URLs |
| **Contradictions** | Glosses over conflicts to maintain smooth prose | Verifier agent isolates conflicting data points |
| **Epistemic Clarity** | Blends facts, guesses, and assumptions together | Strictly separates **Facts**, **Inferences**, and **Uncertainties** |
| **Reasoning Depth** | Single forward-pass generation | Multi-agent consensus with dynamic verification feedback loop |
| **Confidence** | Uncalibrated, overconfident assertions | Model-assessed confidence score backed by cross-corroboration |
| **Auditability** | Ephemeral, opaque text stream | Full docket with Claim IDs, sources, risks, and next steps |

---

## 💡 THE SOLUTION: MULTI-AGENT CONSENSUS GRAPH

KineticMesh coordinates four distinct agents to deliberate on strategic inquiries:
1. **Orchestrator**: Formulates the inquiry into distinct empirical research vectors.
2. **Researcher**: Retrieves real-world citations and extracts atomic claims via Google Search grounding.
3. **Verifier**: Evaluates claim credibility, flags contradictions, and triggers a feedback loop if uncertainty is elevated.
4. **Decision Maker**: Synthesizes a defended recommendation, assigns a model-assessed confidence score, and structures the risk envelope.

---

## 🏛️ SYSTEM ARCHITECTURE & DYNAMIC FEEDBACK LOOP

```text
                        STRATEGIC OBJECTIVE
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   1. ORCHESTRATOR     │
                     │  Decompose & Scoping  │
                     └───────────┬───────────┘
                                 │ (Empirical Vectors)
                                 ▼
                     ┌───────────────────────┐
                     │    2. RESEARCHER      │
                     │ Google Search Ground  │
                     └───────────┬───────────┘
                                 │ (Grounded Claims & URLs)
                                 ▼
                     ┌───────────────────────┐
                     │     3. VERIFIER       │
                     │  Cross-Check & Audit  │
                     └───────────┬───────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   │                           │
                   ▼                           ▼
            [HIGH CONFIDENCE]          [CONTRADICTIONS / GAPS]
                   │                           │
                   │                           ▼
                   │               ┌───────────────────────┐
                   │               │ DYNAMIC FEEDBACK LOOP │
                   │               │ Targeted Re-Grounding │
                   │               └───────────┬───────────┘
                   │                           │
                   │                           ▼
                   │                 (Second Grounding Pass)
                   │                           │
                   └─────────────┬─────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   4. DECISION MAKER   │
                     │   Defended Synthesis  │
                     └───────────┬───────────┘
                                 │
                                 ▼
                     AUDITABLE DECISION DOCKET
           ├── Defended Stance & Confidence Metric
           ├── Epistemic Triad: Facts vs Inferences vs Gaps
           ├── Grounded Claims (Verified / Conflicting / Uncertain)
           ├── Source Provenance Registry (Live URLs)
           └── Execution Sequence (Phased Next Steps)
```

---

## 🔬 THE FOUR SPECIALIZED AGENTS

| Agent | Core Responsibility | Output Artifact |
|---|---|---|
| 🧭 **Orchestrator** | Analyzes constraints and breaks inquiries into 3 domain focus vectors (Economics, Regulations, Operational Feasibility). | `OrchestratorPlan` with structured `ResearchTask` array |
| 🔎 **Researcher** | Executes Google Search grounding using Gemini 2.5 Flash to extract atomic claims and real web URLs. | List of `GroundedClaim` with `ClaimSource` metadata |
| 🛡️ **Verifier** | Cross-corroborates claims, checks for mutual contradictions, and detects truth states. | `verified_claims` with status and verifier justification note |
| 🧠 **Decision Maker** | Weighs evidence, balances trade-offs, separates epistemic levels, and produces an executive recommendation. | Comprehensive `DecisionResponse` audit docket |

---

## ⚖️ EPISTEMIC RIGOR: FACTS, INFERENCES & UNCERTAINTIES

KineticMesh strictly separates epistemic categories so that decision-makers always know **what is proven** versus **what is deduced**:

- 📌 **Corroborated Facts**: Empirical statements directly supported by independent source citations and verifiable statistics.
- 💡 **Logical Inferences**: Analytical deductions derived from verified premises (e.g., "Pairing 2-hour BESS directly mitigates peak capacity charges").
- ❓ **Uncertainties & Gaps**: Critical unknown variables or external dependencies (e.g., "Grid connection queue latency with local DNO").

### Evidence Classification Matrix:
- `VERIFIED`: Corroborated across authoritative sources without contradiction.
- `CONFLICTING`: Contradicted by industry benchmarks or alternative sources.
- `UNCERTAIN`: Incomplete data requiring sensitivity testing.
- `UNSUPPORTED`: Assertion lacking verifiable empirical backing.

---

## 🚀 QUALITY GATE & HACKATHON CHECKLIST

- [x] **01 Working Demo**: Complete live interactive web app deployed on port 3000 with real-time SSE streaming.
- [x] **02 Public Repo Quality**: Clean directory structure, professional documentation, and standardized scripts.
- [x] **03 Complete README**: Comprehensive problem statement, ASCII diagrams, installation, and API specs.
- [x] **04 Evidence of Quality**: Automated test suite (`test/api.test.mjs`), schema validation, zero committed secrets.
- [x] **05 Transparent AI-Use Declaration**: Transparent disclosure of Gemini 2.5 Flash usage and human system design.
- [x] **06 Two-Minute Pitch Script**: Structured script and embedded interactive modal for presentations.

---

## ⚡ QUICK START & INSTALLATION

### Prerequisites
- Node.js 18+ (or Bun / tsx)
- (Optional) Python 3.10+ for Python FastAPI runtime
- Google Gemini API Key ([Get one free in Google AI Studio](https://aistudio.google.com/))

### 1. Unified Node.js / Express Full-Stack Deployment

```bash
# Clone the repository
git clone https://github.com/anirban-bhowmik-coder/KineticMesh.git
cd KineticMesh

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY

# Run automated test suite
npm test

# Launch production-grade dev server (binds to 0.0.0.0:3000)
npm run dev
```

### 2. Standalone Python FastAPI Backend Deployment

```bash
cd backend

# Create and activate virtualenv
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run pytest suite
pytest tests/

# Launch uvicorn server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Docker Deployment

```bash
cd backend
docker build -t kineticmesh-backend .
docker run -p 8000:8000 --env GEMINI_API_KEY=your_key kineticmesh-backend
```

---

## 📡 API DOCUMENTATION

### 1. Health Telemetry Endpoint
`GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "KineticMesh Decision Engine",
  "version": "2.5.0",
  "gemini_model": "gemini-2.5-flash",
  "gemini_configured": true,
  "agents": ["Orchestrator", "Researcher", "Verifier", "DecisionMaker"],
  "grounding": "Google Search Grounding",
  "timestamp": "2026-09-20T09:55:00.000Z"
}
```

### 2. Multi-Agent Investigation Endpoint
`POST /api/v1/investigate`

**Request Payload:**
```json
{
  "query": "Should a commercial distribution warehouse in Valencia invest in on-site solar PV with battery storage under 2024-2026 Iberian electricity market tariffs?",
  "max_iterations": 2
}
```

**Response Docket:**
```json
{
  "investigation_id": "KM-954C8004",
  "original_query": "Should a commercial distribution warehouse in Valencia...",
  "recommendation": "CONDITIONAL APPROVAL: Phased Solar PV (1.2 MWp) + BESS (1.8 MWh) Deployment with 4.8-Year Payback",
  "confidence_score": 0.89,
  "model_assessed_confidence": 0.89,
  "primary_reasons": [
    "PVPC and Iberian wholesale spread (OMIE) delivers peak-to-trough price differentials exceeding €115/MWh...",
    "On-site PV self-consumption offsets 64% of daytime warehouse refrigeration...",
    "Spanish Royal Decree 244/2019 collective self-consumption framework enables surplus compensation..."
  ],
  "facts": [
    "Industrial grid tariff 6.1TD in eastern Spain imposes P1-P2 peak capacity charges...",
    "Average Levelized Cost of Electricity (LCOE) sits between €0.042 - €0.051/kWh..."
  ],
  "inferences": [
    "Pairing 2-hour C-rate storage directly mitigates penalizing power demand spikes..."
  ],
  "uncertainties": [
    "Local distribution network operator (i-DE / Iberdrola) grid-connection permit queue latency..."
  ],
  "evidence_items": [
    {
      "id": "CLM-SOLAR-01",
      "claim_text": "Valencia logistics corridor averages 1,780 peak sun hours annually, yielding >1,520 kWh/kWp...",
      "sources": [
        { "title": "PVGIS European Commission Solar Database", "url": "https://re.jrc.ec.europa.eu/pvg_tools/en/" }
      ],
      "verification_status": "Verified",
      "verification_note": "Corroborated across JRC Photovoltaic Geographical Information System."
    }
  ],
  "risks": [
    "Grid operator capacity congestion potentially delaying export authorization..."
  ],
  "assumptions": [
    "Warehouse roof structural load tolerance allows ≥18 kg/m² for ballast-mounted PV arrays."
  ],
  "next_steps": [
    "Commission structural roof integrity audit and 15-minute interval electrical load logging.",
    "Submit preliminary grid interconnection consultation to regional DNO.",
    "Tender competitive EPC RFP specifying Tier-1 modules."
  ],
  "iterations_run": 2,
  "created_at": "2026-09-20T09:55:00.000Z"
}
```

### 3. Real-Time Streaming Endpoint
`GET /api/v1/investigate/stream?query=...`

Streams Server-Sent Events (SSE) detailing stage transitions (`ORCHESTRATOR` → `RESEARCHER` → `VERIFIER` → `FEEDBACK_LOOP` → `DECISION_MAKER` → `COMPLETE`).

---

## 🧪 AUTOMATED TEST SUITE

KineticMesh includes an automated API test suite verifying functional contracts and resilience:

```bash
npm test
```

**Test Coverage:**
- `GET /api/health`: Validates system health and confirms all 4 agents are registered.
- `POST /api/v1/investigate (Validation)`: Rejects empty or whitespace-only queries with HTTP 400.
- `POST /api/v1/investigate (Bounds)`: Rejects queries exceeding 2500 characters with HTTP 400.
- `POST /api/v1/investigate (Schema)`: Asserts presence of `investigation_id`, `recommendation`, `confidence_score`, `primary_reasons`, `facts`, `inferences`, `uncertainties`, `evidence_items`, `risks`, and `next_steps`.

---

## 🔒 SECURITY & HARDENING AUDIT

1. **Zero Secret Leaks**: No API keys or cloud credentials committed to version control. Key ingestion occurs strictly via server-side environment variables (`GEMINI_API_KEY`).
2. **CORS Governance**: Configured origin whitelisting across local and deployed environments.
3. **Input Sanitization & Length Caps**: Maximum 2500 character limitation and input stripping prevents prompt injection denial-of-service.
4. **Error Masking**: Production errors do not disclose server filesystem paths or raw stack traces.

---

## 🤖 TRANSPARENT AI-USE DECLARATION

In accordance with hackathon governance and academic integrity standards:

- **Original Architecture**: The multi-agent consensus graph, dynamic verification feedback loop, epistemic classification taxonomy, and product design were architected by **Anirban Bhowmik**.
- **Generative AI Utilization**: Google Gemini 2.5 Flash was utilized as the reasoning engine for:
  - Agent task execution (decomposing queries into search strings).
  - Grounded web search retrieval via Google Search tools.
  - Cross-source claim verification and synthesis.
- **Code Generation & Assistance**: AI Studio coding tools were used for syntax scaffolding, refactoring, and CSS formatting. All operational logic, contracts, and safety checks were reviewed, audited, and tested by humans.

---

## 🎙️ TWO-MINUTE PITCH SCRIPT

> **[0:00 - 0:25] The Problem**  
> *"When business leaders, engineering directors, or policymakers ask an AI for advice on a million-dollar decision—like 'Should we migrate off AWS to on-prem colocation?'—today's chatbots give a smooth, persuasive answer in five seconds. But that answer is an ungrounded hallucination. It doesn't check whether facts are true, it ignores contradictory regulations, and it mashes facts and guesses into one un-auditable blob."*
>
> **[0:25 - 0:55] Introducing KineticMesh**  
> *"That's why I built KineticMesh: Autonomous Decision Intelligence. Our motto is: 'Think through the decision. Don't just answer it.' Instead of a single model spitting out an answer, KineticMesh coordinates four specialized agents in a consensus graph: an Orchestrator that breaks down the problem, a Researcher that retrieves real-world data with Google Search grounding, a Verifier that fact-checks claims, and a Decision Maker that synthesizes a defended stance."*
>
> **[0:55 - 1:30] The Dynamic Verification Feedback Loop**  
> *"What makes KineticMesh fundamentally different is our Dynamic Verification Feedback Loop. When the Verifier detects contradictory evidence or high uncertainty, it doesn't give up or hallucinate—it sends a targeted query back to the Researcher for a second corroboration pass. And when the final decision arrives, it doesn't give you a generic summary. It gives you an auditable docket separating verified Facts from logical Inferences from critical Uncertainties, complete with live source links and an explicit Model-Assessed Confidence score."*
>
> **[1:30 - 2:00] Conclusion & Impact**  
> *"KineticMesh is fully tested, built on Gemini 2.5 Flash and Google Search grounding, and ready for production deployment. It turns AI from a chatbot that guesses into an intelligence engine you can actually stake your business on. Thank you!"*

---

## 👤 AUTHOR & CREDITS

**Anirban Bhowmik**  
*Computer Science & Engineering Student specializing in Artificial Intelligence & Machine Learning*  
- **GitHub**: [@anirban-bhowmik-coder](https://github.com/anirban-bhowmik-coder)  
- **LinkedIn**: [Anirban Bhowmik](https://www.linkedin.com/in/anirban-bhowmik)  
- **Portfolio**: [anirban-bhowmik.vercel.app](https://anirban-bhowmik.vercel.app/)

---

<div align="center">
  <sub>Built with precision for the Autonomous Decision Intelligence Hackathon 2026.</sub>
</div>
