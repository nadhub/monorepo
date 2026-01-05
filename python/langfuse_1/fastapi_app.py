import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os

# Ensure python path is correct for local execution if not running via Bazel
# (In a real deployment, PYTHONPATH should be set correctly)
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from python.langfuse_1.config import AppConfig
from python.langfuse_1.core.llm_service import LLMService
from python.common.m_fastAPI.fastapi_base import create_base_app

app_config = AppConfig()

# Initialize Tracer
if app_config.ENABLE_OBSERVABILITY:
    from python.common.observability.langfuse_tracer import LangfuseTracer
    tracer = LangfuseTracer()
else:
    from python.common.observability.noop_tracer import NoOpTracer
    tracer = NoOpTracer()

# Initialize Service
llm_service = LLMService(api_key=app_config.OPENAI_API_KEY, tracer=tracer, model_name=app_config.LLM_MODEL)

# Create Base App
app = create_base_app(root_path=app_config.ROOT_PATH)

class RecipeRequest(BaseModel):
    prompt: str

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
        # We manually trace this request if observability is enabled
        # Ideally, we would use middleware for full request tracing,
        # but the requirement is "endpoint should send trace".
        # Since LLMService already has tracing, calling it will generate traces.
        # But let's wrap the endpoint logic in a span as well for better visibility.
        
        with tracer.trace(name="POST /gen-recipe", input=request.model_dump()) as span:
            result = llm_service.generate_content(request.prompt)
            if span and hasattr(span, "update"):
                span.update(output=result)
            return {"recipe": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class JokeRequest(BaseModel):
    topic: str

@app.post("/gen-joke")
def generate_joke(request: JokeRequest):
    try:
        # Trace the request
        with tracer.trace(name="POST /gen-joke", input=request.model_dump()) as span:
            # This calls the service which fetches the managed prompt
            result = llm_service.generate_joke(request.topic)
            if span and hasattr(span, "update"):
                span.update(output=result)
            return {"joke": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
