import logging
import os
import ssl
from contextlib import contextmanager
from typing import Any, Generator

from langfuse import Langfuse

from .tracer_interface import TracerInterface

# Configure SSL certificate path for httpx, urllib3, and requests
# This will be picked up by the underlying SSL libraries
_ssl_cert_file = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")
if _ssl_cert_file and os.path.exists(_ssl_cert_file):
    # Set environment variables for requests library to use custom CA bundle
    os.environ["REQUESTS_CA_BUNDLE"] = _ssl_cert_file
    os.environ["CURL_CA_BUNDLE"] = _ssl_cert_file

    # Set the default SSL context to use the custom CA bundle for urllib3 and others
    _original_create_default_https_context = ssl._create_default_https_context
    ssl._create_default_https_context = lambda: ssl.create_default_context(
        cafile=_ssl_cert_file
    )

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

        # Initialize Langfuse with optional custom host
        langfuse_host = os.environ.get("LANGFUSE_HOST", "https://cloud.langfuse.com")

        # Create httpx client with custom CA bundle if SSL_CERT_FILE is set
        # import httpx

        # httpx_client = None
        # ssl_cert_file = os.environ.get("SSL_CERT_FILE")
        # if ssl_cert_file:
        #     workbench_api_key = os.environ.get("WORKBENCH_API_KEY", "")
        #     headers = {"Proxy-Authorization": workbench_api_key}
        #     logger.info("#########################")
        #     logger.info(headers)
        #     httpx_client = httpx.Client(headers=headers, verify=ssl_cert_file)

        self.langfuse = Langfuse(
            public_key=os.environ.get("LANGFUSE_PUBLIC_KEY"),
            secret_key=os.environ.get("LANGFUSE_SECRET_KEY"),
            host=langfuse_host,
            # httpx_client=httpx_client,
        )
        logger.info(f"Langfuse initialized with host: {langfuse_host}")

    @contextmanager
    def trace(self, name: str, **kwargs) -> Generator[Any, None, None]:
        """
        Creates a trace span for manual instrumentation.

        Args:
            name: The name of the trace.
            **kwargs: Additional arguments passed to Langfuse.
        """
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
