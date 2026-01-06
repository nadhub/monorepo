import litellm

try:
    from python.common.observability.tracer_interface import TracerInterface
except ImportError:
    from ...common.observability.tracer_interface import TracerInterface


class LLMService:
    """
    Business logic for interacting with OpenAI-compatible LLMs via LiteLLM.
    Decoupled from specific observability implementation.
    """

    def __init__(
        self,
        api_key: str,
        base_url: str,
        tracer: TracerInterface,
        model_name: str = "gpt-4o-mini",
    ):
        self.api_key = api_key
        self.tracer = tracer
        self.model_name = model_name
        self.base_url = base_url

    def generate_content(self, prompt: str, model_name: str | None = None) -> str:
        """
        Generates content using OpenAI-compatible API via LiteLLM with tracing.
        """
        model = model_name or self.model_name

        with self.tracer.trace(
            name="LLMService.generate_content", input=prompt
        ) as trace:
            try:
                response = litellm.completion(
                    base_url=self.base_url,
                    model=model,
                    messages=[{"role": "user", "content": prompt}],
                    api_key=self.api_key,
                )

                result_text = response.choices[0].message.content

                if trace and hasattr(trace, "update"):
                    trace.update(output=result_text)

                return result_text
            except Exception as e:
                raise e

    def generate_joke(self, topic: str) -> str:
        """
        Generates a joke about the given topic using a managed prompt.
        """
        try:
            prompt_obj = self.tracer.get_prompt("joke/joke-generator")
            compiled_prompt = prompt_obj.compile(topic=topic)

            return self.generate_content(compiled_prompt)
        except Exception as e:
            print(f"Error fetching managed prompt: {e}")
            fallback_prompt = f"Tell me a joke about {topic}"
            return self.generate_content(fallback_prompt)
