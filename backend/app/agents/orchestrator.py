"""Orchestrator Agent: Decomposes complex strategic inquiries into verifiable empirical vectors."""
from app.core.gemini import get_gemini_client, extract_json_payload
from app.schemas.decision import OrchestratorPlan, ResearchTask

class OrchestratorAgent:
    def __init__(self, model_name: str = "gemini-3.6-flash"):
        self.model_name = model_name

    async def plan(self, query: str) -> OrchestratorPlan:
        client = get_gemini_client()
        if not client:
            return self._fallback_plan(query)

        prompt = f"""You are the Orchestrator Agent for KineticMesh, an autonomous decision intelligence engine.
Decompose this high-stakes inquiry into 3 targeted empirical research tasks to evaluate economics, regulations/standards, and operational feasibility:
INQUIRY: "{query}"

Return ONLY a valid JSON object matching this schema:
{{
  "objective": "Concise statement of core decision",
  "constraints": ["Constraint 1", "Constraint 2"],
  "research_tasks": [
    {{ "task_id": "TASK-01", "focus_area": "Economic & Financial Factors", "search_query": "{query} financial cost return economics" }},
    {{ "task_id": "TASK-02", "focus_area": "Regulatory & Market Standards", "search_query": "{query} regulation standard legal benchmark" }},
    {{ "task_id": "TASK-03", "focus_area": "Operational & Feasibility Risks", "search_query": "{query} operational feasibility risk reliability" }}
  ]
}}"""
        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={
                    "temperature": 0.1,
                    "response_mime_type": "application/json",
                }
            )
            data = extract_json_payload(response.text or "")
            if data and "research_tasks" in data:
                tasks = [
                    ResearchTask(
                        task_id=t.get("task_id", f"TASK-0{idx+1}"),
                        focus_area=t.get("focus_area", "General Domain"),
                        search_query=t.get("search_query", query)
                    )
                    for idx, t in enumerate(data.get("research_tasks", []))
                ]
                return OrchestratorPlan(
                    objective=data.get("objective", query),
                    constraints=data.get("constraints", ["Operational Feasibility", "Cost Discipline"]),
                    research_tasks=tasks or self._fallback_plan(query).research_tasks
                )
        except Exception as e:
            print(f"[KineticMesh Orchestrator] API exception: {e}")

        return self._fallback_plan(query)

    def _fallback_plan(self, query: str) -> OrchestratorPlan:
        return OrchestratorPlan(
            objective=query,
            constraints=["Capital Expenditure Limits", "Regulatory Compliance", "Execution Timeframe"],
            research_tasks=[
                ResearchTask(task_id="TASK-01", focus_area="Economic & Financial Factors", search_query=f"{query} costs economics ROI"),
                ResearchTask(task_id="TASK-02", focus_area="Regulatory & Compliance", search_query=f"{query} regulation compliance standard"),
                ResearchTask(task_id="TASK-03", focus_area="Operational & Technical Feasibility", search_query=f"{query} operational risk benchmarks")
            ]
        )
