import logging
from google import genai
from app.core.config import settings

logger = logging.getLogger("kineticmesh.gemini")

def call_gemini_with_fallback(client: genai.Client, contents, config=None):
    """
    Attempts generation with the configured model. If Google returns a 404 
    (model retired for new keys), automatically falls back to active models.
    """
    candidate_models = [
        settings.GEMINI_MODEL,
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-2.5-flash"
    ]
    
    # Deduplicate while preserving priority order
    models_to_try = []
    for m in candidate_models:
        if m and m not in models_to_try:
            models_to_try.append(m)

    last_exc = None
    for model_name in models_to_try:
        try:
            logger.info(f"Invoking Gemini model: {model_name}")
            return client.models.generate_content(
                model=model_name,
                contents=contents,
                config=config
            )
        except Exception as e:
            err_msg = str(e).lower()
            if "404" in err_msg or "not found" in err_msg or "no longer available" in err_msg:
                logger.warning(f"Model {model_name} unavailable (404). Falling back to next candidate...")
                last_exc = e
                continue
            # For non-404 errors (quota, auth), raise immediately
            raise e

    raise last_exc or RuntimeError("All candidate Gemini models failed.")