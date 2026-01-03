import os
import sys
from typing import Optional

import uvicorn
from fastapi import HTTPException
from langfuse import observe
from pydantic import BaseModel

# Ensure python path is correct for local execution if not running via Bazel
# (In a real deployment, PYTHONPATH should be set correctly)
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from python.common.m_fastAPI.fastapi_base import create_base_app
from python.langfuse_1.config import AppConfig
from python.langfuse_1.core.gemini_service import GeminiService

app_config = AppConfig()

# Initialize Tracer
if app_config.ENABLE_OBSERVABILITY:
    from python.common.observability.langfuse_tracer import LangfuseTracer

    tracer = LangfuseTracer()
else:
    from python.common.observability.noop_tracer import NoOpTracer

    tracer = NoOpTracer()

# Initialize Service
gemini_service = GeminiService(api_key=app_config.GOOGLE_API_KEY, tracer=tracer)

# Create Base App
app = create_base_app(root_path=app_config.ROOT_PATH)


class RecipeRequest(BaseModel):
    prompt: str
    user_id: Optional[str] = None


@observe
@app.get("/health")
def health_check():
    with tracer.trace(name="GET /health") as span:
        msg = {"message": "OK", "status": "200"}
        if span and hasattr(span, "update"):
            span.update(output=msg)
        return msg


@app.post("/gen-recipe")
def generate_recipe(request: RecipeRequest):
    try:
        # We manually trace this request because @observe context propagation
        # is failing in this environment (causing "No active span" errors).
        # Manual tracing with explicit trace object update works reliably.

        with tracer.trace(
            name="POST /gen-recipe", input=request.model_dump(), user_id=request.user_id
        ) as span:
            result = gemini_service.generate_content(request.prompt)
            if span and hasattr(span, "update"):
                span.update(output=result)
            return {"recipe": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class JokeRequest(BaseModel):
    topic: str
    user_id: Optional[str] = None


@app.post("/gen-joke")
def generate_joke(request: JokeRequest):
    try:
        # Trace the request manually to ensure user_id is set correctly
        # without relying on global context propagation
        with tracer.trace(
            name="POST /gen-joke", input=request.model_dump(), user_id=request.user_id
        ) as span:
            # This calls the service which fetches the managed prompt
            result = gemini_service.generate_joke(request.topic)
            if span and hasattr(span, "update"):
                span.update(output=result)
            return {"joke": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
