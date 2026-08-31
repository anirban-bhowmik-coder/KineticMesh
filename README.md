# KIRO — Autonomous Decision Intelligence

> **Don't just get an answer. Get a decision you can defend.**

**KIRO** is a multi-agent intelligence system designed to help people make complex decisions using **research, verification, and structured reasoning**.

Instead of relying on a single AI response, KIRO breaks a problem into smaller tasks, gathers evidence from multiple sources, challenges conflicting information, and synthesizes the findings into a transparent recommendation.

Every decision is accompanied by its **evidence, assumptions, uncertainties, risks, and reasoning path**.

**KIRO doesn't hide uncertainty. It makes it visible.**

---

## Why KIRO?

Most AI systems follow a simple pattern:

```text
Question → AI → Answer
```

KIRO follows a different approach:

```text
Question
   ↓
Understand
   ↓
Decompose
   ↓
Research
   ↓
Verify
   ↓
Challenge Conflicts
   ↓
Reason
   ↓
Decision
```

This allows KIRO to separate what is **known** from what is **inferred** and what remains **uncertain**.

The result isn't simply an answer.

It's a decision that can be inspected, questioned, and defended.

---

# 🤖 Four-Agent Intelligence

KIRO uses four specialized agents, each responsible for a distinct stage of the decision process.

| Agent                 | Role         | Responsibility                                                                                                                                  |
| --------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 🧭 **Orchestrator**   | Planner      | Understands the objective, decomposes it into research tasks, coordinates the agents, and determines when additional investigation is required. |
| 🔎 **Researcher**     | Investigator | Searches for relevant information and extracts atomic claims with their supporting sources.                                                     |
| 🛡️ **Verifier**      | Challenger   | Cross-checks claims, detects contradictions, evaluates evidence quality, and identifies unsupported or uncertain information.                   |
| 🧠 **Decision Maker** | Strategist   | Synthesizes verified evidence into a recommendation with confidence, risks, assumptions, and actionable next steps.                             |

### The agents don't simply pass text around.

Each stage has a defined responsibility and structured input/output contract.

If the evidence isn't strong enough, the workflow can return to research rather than forcing a conclusion.

```text
                    USER
                      │
                      ▼
              ┌──────────────┐
              │ ORCHESTRATOR │
              │    PLAN      │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │  RESEARCHER  │
              │    FIND      │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   VERIFIER   │
              │ CHECK + TEST │
              └──────┬───────┘
                     │
              ┌──────┴──────┐
              │             │
          Evidence OK    Evidence Weak
              │             │
              │             └──────→ Research Again
              ▼
       ┌───────────────┐
       │ DECISION MAKER│
       │   REASON      │
       └───────┬───────┘
               │
               ▼
          FINAL DECISION
```

---

# 🔬 Evidence Before Confidence

KIRO is built around a simple principle:

> **Confidence should come from evidence, not from how convincing an answer sounds.**

Every important conclusion follows an evidence chain:

```text
Decision
   ↓
Reason
   ↓
Verified Claim
   ↓
Evidence
   ↓
Source
```

Claims are classified into four states:

### ✓ Verified

The available evidence sufficiently supports the claim.

### ⚠ Conflicting

Credible sources disagree and the disagreement must be considered.

### ⚠ Uncertain

Evidence exists, but it isn't strong enough for a confident conclusion.

### ✕ Unsupported

The available evidence does not adequately support the claim.

This prevents conflicting information from being silently averaged into a seemingly certain answer.

---

# 🧩 What KIRO Produces

A KIRO investigation doesn't end with a paragraph of generated text.

The result is structured into:

### Decision

The recommended course of action.

### Confidence

How strongly the available evidence supports that recommendation.

### Evidence

The important claims and their sources.

### Facts

Information directly supported by evidence.

### Inferences

Conclusions derived from verified information.

### Uncertainties

Variables that remain unresolved or require additional data.

### Risks

Factors that could materially change the recommendation.

### Next Steps

Concrete actions the user can take.

---

# 🌍 Designed for Complex Decisions

KIRO is designed around problems where the answer isn't contained in a single source.

For example:

> **"Should a commercial facility invest in solar panels with battery storage?"**

KIRO can investigate:

* current market conditions
* regulations
* installation costs
* operating costs
* incentives
* historical data
* technical constraints
* competing projections

If two sources disagree, the Verifier investigates the disagreement rather than silently selecting whichever answer looks better.

The final recommendation can therefore say:

> **Proceed — but only under these conditions.**

rather than pretending the decision is simply *yes* or *no*.

---

# 🏗️ Architecture

```text
┌───────────────────────────────────────────┐
│                KIRO UI                    │
│             React + Vite                  │
└─────────────────────┬─────────────────────┘
                      │
                      │ HTTP / JSON
                      ▼
┌───────────────────────────────────────────┐
│              FASTAPI API                  │
│       Validation + Application State      │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │ ORCHESTRATOR  │
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │   RESEARCHER  │
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │    VERIFIER   │
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │ DECISION MAKER│
              └───────┬───────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   Evidence / State          Final Decision
```

---

# ⚙️ Technology Stack

### Frontend

* React 18
* Vite
* Tailwind CSS
* Lucide Icons

### Backend

* Python 3.11
* FastAPI
* Uvicorn
* Pydantic v2

### AI & Agents

* Google GenAI SDK
* Gemini
* Google Search grounding
* Structured agent contracts

### Infrastructure

* Docker
* Google Cloud Run

The architecture is intentionally modular so additional models, tools, data sources, and agent capabilities can be introduced without redesigning the entire system.

---

# 📁 Project Structure

```text
kiro/
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── orchestrator.py
│   │   │   ├── researcher.py
│   │   │   ├── verifier.py
│   │   │   └── decision_maker.py
│   │   │
│   │   ├── core/
│   │   ├── schemas/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── architecture.md
│
├── .env.example
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 🚀 Run Locally

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt

python -m uvicorn app.main:app --reload --port 8000
```

### Frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

Create a `.env` file inside `backend/`:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=your_supported_gemini_model
```

Never commit API keys, credentials, or `.env` files to the repository.

---

# 🛡️ Reliability Principles

KIRO is designed with an important constraint:

> **When the evidence isn't sufficient, the system should be able to say "I don't know."**

The system therefore aims to:

* preserve source attribution
* surface conflicting evidence
* distinguish facts from inferences
* expose uncertainty
* avoid unsupported conclusions
* validate structured agent outputs
* preserve an investigation trail
* request additional research when evidence is insufficient

The system does not treat fluent language as proof.

---

# 🛣️ Roadmap

### Foundation

* [x] React interface
* [x] FastAPI backend
* [x] Structured decision schema
* [x] Local development environment

### Intelligence

* [ ] Live Gemini integration
* [ ] Orchestrator agent
* [ ] Research agent
* [ ] Grounded search

### Verification

* [ ] Cross-source verification
* [ ] Conflict detection
* [ ] Evidence classification
* [ ] Conditional re-research

### Decision Intelligence

* [ ] Evidence-weighted recommendations
* [ ] Confidence estimation
* [ ] Risk analysis
* [ ] Action planning

### Cloud

* [ ] Containerized deployment
* [ ] Google Cloud Run
* [ ] Production configuration
* [ ] Observability

### Future

* [ ] Persistent decision memory
* [ ] Additional tools and data sources
* [ ] Multimodal investigations
* [ ] Continuous decision monitoring
* [ ] Expanded autonomous workflows

---

# 📜 License

MIT License

---

## KIRO

**Know. Verify. Decide.**

> **Don't just get an answer. Get a decision you can defend.**

