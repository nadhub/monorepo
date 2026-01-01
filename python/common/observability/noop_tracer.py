from contextlib import contextmanager
from typing import Generator

from .tracer_interface import TracerInterface


class DummyPrompt:
    """Fallback prompt object for when Langfuse is unavailable."""

    def __init__(self, name: str) -> None:
        self.name = name

    def compile(self, **kwargs) -> str:
        """Rudimentary compilation for fallback."""
        return f"Fallback prompt for {self.name} with args: {kwargs}"


class NoOpTracer(TracerInterface):
    """
    Null Object implementation of TracerInterface.
    Used when observability is disabled.
    """

    def __init__(self) -> None:
        pass

    @contextmanager
    def trace(self, name: str, **kwargs) -> Generator[None, None, None]:
        """No-op trace context manager."""
        yield None

    @contextmanager
    def span(self, name: str, **kwargs) -> Generator[None, None, None]:
        """No-op span context manager."""
        yield None

    def get_prompt(self, name: str) -> DummyPrompt:
        """Returns a DummyPrompt as fallback."""
        return DummyPrompt(name)

    def shutdown(self) -> None:
        """No-op shutdown."""
        pass
