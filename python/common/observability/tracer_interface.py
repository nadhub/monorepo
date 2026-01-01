from abc import ABC, abstractmethod
from typing import Any, Generator


class TracerInterface(ABC):
    """
    Abstract Base Class for Tracing.
    This allows the business logic to be decoupled from the specific tracing implementation.
    """

    @abstractmethod
    def trace(self, name: str, **kwargs) -> Generator[Any, None, None]:
        """
        Abstract context manager to start a trace.

        Args:
            name: The name of the trace.
            **kwargs: Additional arguments for the tracing implementation.
        """
        pass

    @abstractmethod
    def span(self, name: str, **kwargs) -> Generator[Any, None, None]:
        """
        Abstract context manager to create a span.

        Args:
            name: The name of the span.
            **kwargs: Additional arguments for the tracing implementation.
        """
        pass

    @abstractmethod
    def get_prompt(self, name: str) -> Any:
        """
        Abstract method to retrieve a prompt by its name.

        Args:
            name: The name of the prompt to retrieve.
        """
        pass

    @abstractmethod
    def shutdown(self) -> None:
        """
        Flushes and shuts down the tracer.
        """
        pass
