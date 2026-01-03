import logging
from contextlib import contextmanager
from typing import Any, Generator

from langfuse import get_client

from .tracer_interface import TracerInterface

# Configure a specific logger for this module
logger = logging.getLogger("langfuse_tracer")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(
    logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
)
logger.addHandler(handler)


class LangfuseTracer(TracerInterface):
    """
    Implementation of TracerInterface using Langfuse and OpenInference.
    """

    def __init__(self) -> None:
        logger.info("Initializing LangfuseTracer")
        self.langfuse = get_client()

        # Initialize automatic instrumentation for Google GenAI
        # This will automatically capture calls made via the google-genai SDK
        # GoogleGenAIInstrumentor().instrument()
        # logger.info("Google GenAI instrumentation enabled")

    @contextmanager
    def trace(self, name: str, **kwargs) -> Generator[Any, None, None]:
        """
        Creates a trace span for manual instrumentation.

        Args:
            name: The name of the trace.
            **kwargs: Additional arguments passed to Langfuse.
        """
        user_id = kwargs.pop("user_id", None)
        trace = self.langfuse.start_span(name=name, **kwargs)
        if user_id:
            # We must update the specific trace object because start_span
            # might not set the global context for update_current_trace to work.
            if hasattr(trace, "update"):
                trace.update(user_id=user_id)
        logger.debug(f"Started trace: {name} with kwargs: {kwargs}")
        try:
            yield trace
        except Exception as e:
            trace.update(level="ERROR", status_message=str(e))
            raise
        finally:
            trace.end()

    @contextmanager
    def span(self, name: str, **kwargs) -> Generator[Any, None, None]:
        """
        Creates a child span within a trace.

        Args:
            name: The name of the span.
            **kwargs: Additional arguments passed to Langfuse.
        """
        span = self.langfuse.start_span(name=name, **kwargs)
        logger.debug(f"Started span: {name} with kwargs: {kwargs}")
        try:
            yield span
        except Exception as e:
            span.update(level="ERROR", status_message=str(e))
            raise
        finally:
            span.end()

    def get_prompt(self, name: str) -> Any:
        """
        Retrieves a managed prompt from Langfuse.

        Args:
            name: The name of the prompt to retrieve.
        """
        return self.langfuse.get_prompt(name)

    def shutdown(self) -> None:
        """Flushes pending events and shuts down the tracer."""
        logger.info("Flushing Langfuse events...")
        self.langfuse.flush()
        logger.info("Langfuse flushed.")
