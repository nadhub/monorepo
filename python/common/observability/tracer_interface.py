from abc import ABC, abstractmethod

class TracerInterface(ABC):
    """
    Abstract Base Class for Tracing.
    This allows the business logic to be decoupled from the specific tracing implementation.
    """

    @abstractmethod
    def trace(self, **kwargs):
        """
        Abstract context manager or decorator to start a trace.
        The signature is flexible to accommodate various tracing needs,
        but typically it would accept a name, input, etc.
        """
        pass

    @abstractmethod
    def span(self, **kwargs):
        """
        Abstract context manager to create a span.
        """
        pass

    @abstractmethod
    def shutdown(self):
        """
        Flushes and shuts down the tracer.
        """
        pass
