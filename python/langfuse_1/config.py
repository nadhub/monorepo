from typing import Optional

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppConfig(BaseSettings):
    """
    Application Configuration using Pydantic Settings.
    """

    # OpenAI-compatible LLM Settings
    OPENAI_API_KEY: str = Field(..., description="API Key for OpenAI-compatible LLM")
    OPENAI_BASE_URL: str = Field(
        "https://api.openai.com/v1", description="API Base URL for OpenAI-compatible LLM"
    )
    LLM_MODEL: str = Field("gpt-4o-mini", description="Model name to use with LiteLLM")

    # App Settings
    ROOT_PATH: str = Field(
        "", description="Root path for the API", validation_alias="ROOT_PATH"
    )

    # Observability Settings
    ENABLE_OBSERVABILITY: bool = Field(
        False, description="Flag to enable/disable observability"
    )
    LANGFUSE_PUBLIC_KEY: Optional[str] = Field(None, description="Langfuse Public Key")
    LANGFUSE_SECRET_KEY: Optional[str] = Field(None, description="Langfuse Secret Key")
    LANGFUSE_HOST: str = Field(
        "https://cloud.langfuse.com", description="Langfuse Host URL"
    )

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    @model_validator(mode="after")
    def check_observability_keys(self):
        """
        Validates that Langfuse keys are present if observability is enabled.
        """
        if self.ENABLE_OBSERVABILITY:
            if not self.LANGFUSE_PUBLIC_KEY:
                raise ValueError(
                    "LANGFUSE_PUBLIC_KEY must be set when ENABLE_OBSERVABILITY is True"
                )
            if not self.LANGFUSE_SECRET_KEY:
                raise ValueError(
                    "LANGFUSE_SECRET_KEY must be set when ENABLE_OBSERVABILITY is True"
                )
        return self
