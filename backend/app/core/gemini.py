"""Gemini client interface and helper utilities."""
import os
import json
import re
from typing import Optional, Any
from .config import settings

def get_gemini_client():
    """Initializes Google GenAI client lazily if GEMINI_API_KEY is present."""
    api_key = os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY
    if not api_key:
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        print(f"[KineticMesh] Warning: Could not initialize google.genai: {e}")
        return None

def extract_json_payload(text: str) -> Optional[Any]:
    """Safely extracts JSON dictionaries or arrays from markdown blocks or raw text."""
    if not text:
        return None
    cleaned = text.strip()
    if "```" in cleaned:
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", cleaned)
        if match:
            try:
                return json.loads(match.group(1))
            except Exception:
                return None
        return None
