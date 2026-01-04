from typing import Optional

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppConfig(BaseSettings):
    """
    Application Configuration using Pydantic Settings.
    """

    # Google GenAI Settings
    GOOGLE_API_KEY: str = Field(..., description="API Key for Google GenAI")

    # App Settings
    # ROOT_PATH: str = Field("", description="Root path for the API", validation_alias="ROOT_PATH")

    # Observability Settings
    LANGFUSE_PUBLIC_KEY: Optional[str] = Field(None, description="Langfuse Public Key")
    LANGFUSE_SECRET_KEY: Optional[str] = Field(None, description="Langfuse Secret Key")
    LANGFUSE_HOST: str = Field(
        "https://cloud.langfuse.com", description="Langfuse Host URL"
    )
    EXA_API_KEY: Optional[str] = Field(None, description="Exa API Key")
    LLM_API_PROVIDER: Optional[str] = Field(
        "google_genai", description="LLM API Provider"
    )

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    @model_validator(mode="after")
    def check_observability_keys(self):
        """
        Validates that Langfuse keys are present if observability is enabled.
        """
        if not self.LANGFUSE_PUBLIC_KEY:
            raise ValueError(
                "LANGFUSE_PUBLIC_KEY must be set when ENABLE_OBSERVABILITY is True"
            )
        if not self.LANGFUSE_SECRET_KEY:
            raise ValueError(
                "LANGFUSE_SECRET_KEY must be set when ENABLE_OBSERVABILITY is True"
            )
        return self

    @model_validator(mode="after")
    def check_exa_key(self):
        """
        Validates that Exa key is present.
        """
        if not self.EXA_API_KEY:
            raise ValueError("EXA_API_KEY must be set")
        return self
