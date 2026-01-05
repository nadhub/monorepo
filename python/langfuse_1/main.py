import logging
import sys

from python.langfuse_1.config import AppConfig
from python.langfuse_1.core.llm_service import LLMService
from python.common.observability.tracer_interface import TracerInterface

# Configure root logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

def get_tracer(config: AppConfig) -> TracerInterface:
    """
    Factory method to instantiate the correct tracer based on configuration.
    """
    if config.ENABLE_OBSERVABILITY:
        logger.info("Observability enabled. Initializing LangfuseTracer.")
        from python.common.observability.langfuse_tracer import LangfuseTracer
        return LangfuseTracer()
    else:
        logger.info("Observability disabled. Initializing NoOpTracer.")
        from python.common.observability.noop_tracer import NoOpTracer
        return NoOpTracer()

def main():
    try:
        # 1. Load Configuration
        config = AppConfig()
        logger.info("Configuration loaded successfully.")

        # 2. Composition Root: Wire up dependencies
        tracer = get_tracer(config)
        service = LLMService(api_key=config.OPENAI_API_KEY, tracer=tracer, model_name=config.LLM_MODEL)

        # 3. Run Application Logic
        prompt = "Write a haiku about a software engineer building a compiler."
        logger.info(f"Generating content for prompt: '{prompt}'")
        
        result = service.generate_content(prompt)
        
        print("\n--- Generated Result ---\n")
        print(result)
        print("\n------------------------\n")

        # 4. Cleanup
        tracer.shutdown()

    except Exception as e:
        logger.error(f"Application failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
