from google import genai
from google.genai import types

# Assuming strict imports within monorepo structure, but relative import for local dev
# In Bazel, this would be an absolute import like `langfuse_1.common.observability.tracer_interface`
# Adjusting to relative for file location context.
try:
    from python.common.observability.tracer_interface import TracerInterface
except ImportError:
    # Fallback/Mock for when running standalone without full pythonpath
    from ...common.observability.tracer_interface import TracerInterface

class GeminiService:
    """
    Business logic for interacting with Google GenAI.
    Decoupled from specific observability implementation.
    """

    def __init__(self, api_key: str, tracer: TracerInterface):
        self.client = genai.Client(api_key=api_key)
        self.tracer = tracer

    def generate_content(self, prompt: str, model_name: str = "gemini-2.5-flash") -> str:
        """
        Generates content using Google GenAI with tracing.
        """
        
        # Start a trace for this operation
        # We pass the input to the trace for observability context
        with self.tracer.trace(name="GeminiService.generate_content", input=prompt) as trace:
            try:
                # The actual call to Google GenAI
                # OpenInference should automatically pick this up if instrumented
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                
                result_text = response.text
                
                # If using manual trace object (like Langfuse), we might want to attach output
                if trace:
                    # Depending on the interface contract, we might want to set output
                    # For Langfuse @observe, it captures return value automatically.
                    # For manual trace, we update it.
                     if hasattr(trace, "update"):
                        trace.update(output=result_text)
                
                return result_text
            except Exception as e:
                # The tracer exit logic should handle the exception status update
                raise e

    def generate_joke(self, topic: str) -> str:
        """
        Generates a joke about the given topic using a managed prompt.
        """
        try:
            # Retrieve managed prompt
            prompt_obj = self.tracer.get_prompt("joke/joke-generator")
            # Compile prompt with the variable 'topic'
            compiled_prompt = prompt_obj.compile(topic=topic)
            
            # Use the compiled prompt for generation
            return self.generate_content(compiled_prompt)
        except Exception as e:
            # Fallback if prompt fetching or compilation fails (e.g. prompt not found)
            print(f"Error fetching managed prompt: {e}")
            fallback_prompt = f"Tell me a joke about {topic}"
            return self.generate_content(fallback_prompt)
