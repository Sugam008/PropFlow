from typing import Any

from pydantic import AnyHttpUrl, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "PropFlow"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "change-me-in-env"  # Override in environment
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of strings
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list | str):
            return v
        raise ValueError(v)

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "propflow"
    SQLALCHEMY_DATABASE_URI: str | PostgresDsn | None = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str | None, info: Any) -> Any:
        if isinstance(v, str):
            return v

        # In Pydantic V2, we access other fields through info.data
        # Note: field_validator might be called before all fields are populated
        # but for simplicity in this dev environment we can use the defaults
        # or provided values
        data = info.data
        return PostgresDsn.build(
            scheme="postgresql",
            username=data.get("POSTGRES_USER"),
            password=data.get("POSTGRES_PASSWORD"),
            host=data.get("POSTGRES_SERVER"),
            path=f"{data.get('POSTGRES_DB') or ''}",
        )

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # S3 / MinIO
    S3_ENDPOINT_URL: str = "http://localhost:9000"
    AWS_ACCESS_KEY_ID: str = "minioadmin"
    AWS_SECRET_ACCESS_KEY: str = "minioadmin"
    AWS_REGION: str = "us-east-1"
    S3_BUCKET: str = "propflow-uploads"
    ENVIRONMENT: str = "local"

    # Twilio SMS
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_FROM_NUMBER: str = ""

    # WhatsApp
    WHATSAPP_API_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""

    # Google Vision API
    GOOGLE_VISION_API_KEY: str = ""

    # Mapbox
    MAPBOX_ACCESS_TOKEN: str = ""

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
