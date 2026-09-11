# KIRO — Autonomous Decision Intelligence

> **Don't just get an answer. Get a decision you can defend.**

KIRO is a multi-agent decision intelligence system designed for complex questions where a reliable answer requires more than a single AI response.

Instead of asking one model to research, verify, and decide at once, KIRO separates the workflow into four specialized agents:

**Plan → Research → Verify → Decide**

KIRO gathers information from multiple sources, identifies conflicting claims, evaluates the available evidence, and produces a structured recommendation with its supporting evidence, assumptions, risks, and uncertainties.

> **KIRO doesn't hide uncertainty. It makes it visible.**

---

## Why KIRO?

A conventional AI workflow often looks like:

```text
User Question
      ↓
   AI Model
      ↓
    Answer
```

This can work well for general questions, but complex decisions introduce a different problem:

> **How do you know the answer is actually supported?**

Important decisions can depend on:

* multiple information sources
* changing data
* conflicting claims
* incomplete information
* different assumptions
* source reliability
* competing alternatives

KIRO turns this into a structured investigation:

```text
Question
   ↓
Understand the objective
   ↓
Decompose the problem
   ↓
Research relevant evidence
   ↓
Verify and cross-check
   ↓
Identify conflicts and uncertainty
   ↓
Reason over verified findings
   ↓
Produce a defensible recommendation
```

The goal isn't to make AI sound more confident.

**The goal is to make the reasoning easier to inspect.**

---

# 🤖 Four-Agent Architecture

KIRO uses four specialized agents with clearly separated responsibilities.

| Agent                 | Role         | Responsibility                                                                                                |
| --------------------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| 🧭 **Orchestrator**   | Planner      | Understands the objective, identifies constraints, decomposes the problem, and coordinates the investigation. |
| 🔎 **Researcher**     | Investigator | Searches for relevant information and extracts claims with supporting source information.                     |
| 🛡️ **Verifier**      | Challenger   | Cross-checks claims, detects contradictions, evaluates evidence quality, and identifies uncertainty.          |
| 🧠 **Decision Maker** | Synthesizer  | Uses the verified findings to produce a recommendation, risks, assumptions, confidence, and next steps.       |

Each agent has a defined input and output contract using **Pydantic models**.

This keeps the agents from becoming four independent chatbots and instead makes them components of one controlled workflow.

---

## 🧭 1. Orchestrator

The Orchestrator is responsible for understanding **what needs to be investigated**.

For example:

```text
User:
"Should I invest in solar with battery storage?"

Orchestrator:

Research Task 1 → Energy economics
Research Task 2 → Installation costs
Research Task 3 → Battery economics
Research Task 4 → Regulations
Research Task 5 → Market conditions
```

The Orchestrator doesn't make the final recommendation.

It creates the investigation plan and coordinates the other agents.

---

## 🔎 2. Researcher

The Researcher is responsible for **finding evidence**.

It uses Gemini together with grounded search capabilities to investigate the tasks created by the Orchestrator.

Its output is structured around claims and their supporting sources rather than a single block of generated text.

Conceptually:

```text
Research Task
      ↓
Search
      ↓
Relevant Sources
      ↓
Claims
      ↓
Evidence Records
```

The Researcher does not decide what the user should do.

---

## 🛡️ 3. Verifier

The Verifier acts as the system's challenge layer.

It asks:

> **"Do we have enough evidence to support this claim?"**

It examines:

* source agreement
* conflicting values
* publication dates
* outdated information
* weak evidence
* unsupported claims

Claims are classified as:

| Status            | Meaning                                                          |
| ----------------- | ---------------------------------------------------------------- |
| ✓ **Verified**    | Available evidence sufficiently supports the claim.              |
| ⚠ **Conflicting** | Sources provide materially different information.                |
| ⚠ **Uncertain**   | Evidence exists but isn't sufficient for a confident conclusion. |
| ✕ **Unsupported** | The available evidence does not adequately support the claim.    |

When important evidence is missing, the investigation can request additional research rather than immediately producing a conclusion.

---

## 🧠 4. Decision Maker

The Decision Maker receives the verified findings and converts them into an actionable result.

A decision contains:

* **Recommendation**
* **Confidence**
* **Supporting reasons**
* **Verified findings**
* **Uncertainties**
* **Risks**
* **Assumptions**
* **Next steps**

KIRO also separates:

### FACT

Information directly supported by evidence.

### INFERENCE

A conclusion derived from the available evidence.

### UNCERTAINTY

Information that remains unresolved or requires additional data.

---

# 🔄 Agent Feedback Loop

The workflow is designed to avoid forcing a decision when the evidence is insufficient.

```text
                 ┌──────────────┐
                 │ Orchestrator │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │  Researcher  │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │   Verifier   │
                 └──────┬───────┘
                        │
              ┌─────────┴─────────┐
              ↓                   ↓
        Evidence sufficient   Evidence weak
              │                   │
              ↓                   ↓
       Decision Maker        More Research
              │                   │
              ↓                   │
            Result ←──────────────┘
```

A maximum investigation depth should be enforced so that unresolved evidence cannot create an infinite agent loop.

---

# 🔬 Evidence Trail

KIRO treats the final recommendation as the end of an evidence chain rather than an isolated AI response.

```text
Decision
   ↓
Reasoning Premise
   ↓
Verified Claim
   ↓
Evidence
   ↓
Source
```

This allows a user to move backwards from a recommendation and inspect the information that contributed to it.

The objective is simple:

> **A user should be able to question the decision without having to blindly trust the model.**

---

# 🌍 Example Investigation

### Question

> **Should a commercial facility invest in solar panels with battery storage?**

KIRO can investigate:

```text
Energy prices
Installation costs
Battery economics
Operating profile
Regulations
Market conditions
Competing projections
```

Suppose the Researcher finds two different payback estimates.

Instead of silently selecting one:

```text
Source A → 4-year estimate
Source B → 8-year estimate
```

the Verifier identifies the disagreement and investigates the underlying assumptions.

The final result could therefore look like:

```text
RECOMMENDATION

Conditional approval

CONFIDENCE

78%

SUPPORTED FINDINGS

✓ Current market conditions
✓ Installation cost range

UNCERTAINTIES

⚠ Future electricity prices
⚠ Actual operating profile

RISKS

• Market volatility
• Storage degradation

NEXT STEPS

1. Obtain current quotations
2. Analyze historical consumption
3. Recalculate using current assumptions
```

The exact recommendation depends on the evidence retrieved during the investigation.

---

# 🧠 Where Gemini Fits

Gemini provides the core model intelligence inside KIRO.

It can be used across different stages for:

```text
                    KIRO
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
      Planning     Research   Verification
          │           │           │
          └───────────┼───────────┘
                      ↓
               Decision Synthesis
```

However, Gemini is **not the entire application**.

The application layer controls:

* agent boundaries
* workflow execution
* Pydantic validation
* tool access
* evidence structures
* verification states
* retries and failure handling
* investigation state
* final response formatting

This separation allows KIRO to use model intelligence without making the entire application dependent on an unstructured model response.

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────────┐
│                 KIRO UI                  │
│              React + Vite                │
└────────────────────┬─────────────────────┘
                     │
                     │ HTTPS / JSON
                     ▼
┌──────────────────────────────────────────┐
│               FastAPI API                │
│     Validation + Workflow Management     │
└────────────────────┬─────────────────────┘
                     │
                     ▼
             ┌───────────────┐
             │ Orchestrator  │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │   Researcher  │
             │ Gemini + Search│
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │    Verifier   │
             └───────┬───────┘
                     │
                ┌────┴────┐
                │         │
              Valid     Insufficient
                │         │
                ↓         └──────→ Research
         ┌───────────────┐
         │ Decision Maker│
         └───────┬───────┘
                 │
                 ↓
          Evidence + Decision
```

---

# ⚙️ Technology Stack

### Frontend

* React 18
* Vite
* Tailwind CSS
* Lucide React

### Backend

* Python 3.11
* FastAPI
* Uvicorn
* Pydantic v2
* HTTPX

### AI

* Google GenAI SDK
* Gemini
* Google Search grounding

### Infrastructure

* Docker
* Google Cloud Run

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
│   │   │   └── config.py
│   │   │
│   │   ├── schemas/
│   │   │   └── decision.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/
│   └── architecture.md
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

# 🚀 Local Setup

## 1. Clone

```bash
git clone https://github.com/anirban-bhowmik-coder/Kiro.git
cd Kiro
```

## 2. Backend

```bash
cd backend

python -m venv venv
```

### Windows

```bash
.\venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the API:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Health check:

```text
http://localhost:8000/health
```

---

## 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

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

Never commit API keys, service-account credentials, or `.env` files to the repository.

---

# ☁️ Deployment

KIRO is containerized for deployment on Google Cloud Run.

The intended production architecture is:

```text
User
 ↓
KIRO
 ↓
Google Cloud Run
 ↓
FastAPI
 ↓
Agent Workflow
 ↓
Gemini + Grounded Search
 ↓
Evidence + Decision
```

The same application architecture can be run locally and in the cloud.

---

# ⚠️ Limitations

KIRO does not guarantee that every generated conclusion is factually correct.

Grounded retrieval and cross-source verification can reduce unsupported conclusions, but they cannot eliminate uncertainty or guarantee the correctness of external information.

KIRO therefore treats:

* source provenance
* conflicting evidence
* uncertainty
* incomplete information

as first-class parts of the decision process.

The system should prefer **"insufficient evidence"** over an unsupported conclusion.

---

# 🛣️ Roadmap

### Foundation

* [x] React interface
* [x] FastAPI backend
* [x] Pydantic data contracts
* [x] Local development environment

### Agent Intelligence

* [ ] Live Gemini integration
* [ ] Orchestrator implementation
* [ ] Researcher implementation
* [ ] Grounded search

### Verification

* [ ] Cross-source verification
* [ ] Conflict detection
* [ ] Evidence classification
* [ ] Conditional re-research

### Decision Intelligence

* [ ] Evidence-backed recommendations
* [ ] Confidence estimation
* [ ] Risk analysis
* [ ] Action planning

### Cloud

* [ ] Production container
* [ ] Google Cloud Run deployment
* [ ] Production configuration
* [ ] Observability

### Future

* [ ] Persistent decision memory
* [ ] Additional data sources
* [ ] Multimodal investigations
* [ ] Continuous decision monitoring
* [ ] Expanded tool-based actions

---

# 📜 License

MIT License

---

# KIRO

### **Know. Verify. Decide.**

> **Don't just get an answer. Get a decision you can defend.**
