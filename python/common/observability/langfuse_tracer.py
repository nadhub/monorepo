import logging
import os
from contextlib import contextmanager

from langfuse import Langfuse, observe
from openinference.instrumentation.google_genai import GoogleGenAIInstrumentor
from .tracer_interface import TracerInterface

# Configure a specific logger for this module
logger = logging.getLogger("langfuse_tracer")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)

class LangfuseTracer(TracerInterface):
    """
    Implementation of TracerInterface using Langfuse and OpenInference.
    """

    def __init__(self):
        logger.info("Initializing LangfuseTracer")
        self.langfuse = Langfuse()
        
        # Initialize automatic instrumentation for Google GenAI
        # This will automatically capture calls made via the google-genai SDK
        GoogleGenAIInstrumentor().instrument()
        logger.info("Google GenAI instrumentation enabled")

    @contextmanager
    def trace(self, name: str, **kwargs):
        """
        Manual tracing using Langfuse decorators/context managers needs careful handling
        if we want to wrap blocks. However, OpenInference handles the library calls.
        For simple wrapping, we can use the observe decorator from langfuse, 
        or manually create spans.
        
        For this implementation, we'll expose a wrapper that uses 
        Langfuse's `observe` functionality if possible, or just logs.
        """
        # Note: @observe is typically used as a decorator. 
        # Using it as a context manager is supported in newer versions or 
        # via `langfuse.trace()`.
        
        # Let's use `langfuse.start_span()` for explicit span creation if needed.
        trace = self.langfuse.start_span(name=name, **kwargs)
        logger.debug(f"Started trace: {name} with kwargs: {kwargs}")
        try:
            yield trace
        except Exception as e:
            trace.update(level="ERROR", status_message=str(e))
            raise
        finally:
            trace.end()

    @contextmanager
    def span(self, name: str, **kwargs):
        """
        Creates a span.
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

    def shutdown(self):
        logger.info("Flushing Langfuse events...")
        self.langfuse.flush()
        logger.info("Langfuse flushed.")
