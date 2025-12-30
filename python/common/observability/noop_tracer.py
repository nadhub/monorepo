from contextlib import contextmanager
from .tracer_interface import TracerInterface

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

    def shutdown(self):
        """
        Does nothing.
        """
        pass
