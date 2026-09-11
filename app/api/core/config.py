from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from env / .env with the GUIATES_ prefix."""

    app_name: str = "Guía TES API"
    version: str = "0.1.0"
    api_prefix: str = "/v1"
    log_level: str = "INFO"
    cors_origins: list[str] = ["http://localhost:3000"]

    # Canonical, read-only knowledge index (repo: guia_tes/knowledge/index.jsonl)
    # config.py -> parents[0]=core, [1]=api, [2]=app, [3]=repo root
    knowledge_index: Path = (
        Path(__file__).resolve().parents[3] / "knowledge" / "index.jsonl"
    )

    model_config = SettingsConfigDict(
        env_prefix="GUIATES_", env_file=".env", extra="ignore"
    )


settings = Settings()
