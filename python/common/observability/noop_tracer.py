from contextlib import contextmanager
from .tracer_interface import TracerInterface

class DummyPrompt:
    def __init__(self, name: str):
        self.name = name

    def compile(self, **kwargs):
        # rudimentary compilation for fallback
        return f"Fallback prompt for {self.name} with args: {kwargs}"

class NoOpTracer(TracerInterface):
    """
    Null Object implementation of TracerInterface.
    Used when observability is disabled.
    """

    def __init__(self):
        pass

    @contextmanager
    def trace(self, **kwargs):
        """
        Does nothing.
        """
        yield None

    @contextmanager
    def span(self, **kwargs):
        """
        Does nothing.
        """
        yield None

    def get_prompt(self, name: str):
        return DummyPrompt(name)

    def shutdown(self):
        """
        Does nothing.
        """
        pass
