import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.decision import ResearchTask

class OrchestratorAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def plan(self, user_query: str) -> list[ResearchTask]:
        if not self.client:
            return [
                ResearchTask(task_id="TASK-1", focus_area="Economic Viability", search_query=f"{user_query} commercial ROI payback years"),
                ResearchTask(task_id="TASK-2", focus_area="Regulatory & Tariffs", search_query=f"{user_query} regulations net billing electricity pool prices"),
                ResearchTask(task_id="TASK-3", focus_area="Operational & Technical Risks", search_query=f"{user_query} degradation risks operational costs")
            ]

        prompt = f"""
        Analyze this decision problem and break it down into 3 targeted research tasks.
        USER PROBLEM: "{user_query}"
        
        Respond with ONLY a raw JSON array containing 3 objects:
        [
          {{"task_id": "TASK-1", "focus_area": "Theme 1", "search_query": "specific search string"}},
          {{"task_id": "TASK-2", "focus_area": "Theme 2", "search_query": "specific search string"}},
          {{"task_id": "TASK-3", "focus_area": "Theme 3", "search_query": "specific search string"}}
        ]
        """
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.2)
            )
            raw_text = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw_text)
            return [ResearchTask(**item) for item in data]
        except Exception:
            return [
                ResearchTask(task_id="TASK-1", focus_area="Economics", search_query=f"{user_query} economic return"),
                ResearchTask(task_id="TASK-2", focus_area="Policy", search_query=f"{user_query} regulatory framework"),
                ResearchTask(task_id="TASK-3", focus_area="Risk", search_query=f"{user_query} operational risks")
            ]