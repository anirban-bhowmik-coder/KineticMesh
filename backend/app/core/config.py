# Pydantic Settings and Environment Configuration
import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "KineticMesh"
    API_V1_STR: str = "/api/v1"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    MAX_ITERATIONS: int = 3
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings(
    GEMINI_API_KEY=os.getenv("GEMINI_API_KEY", ""),
    GEMINI_MODEL=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
)
