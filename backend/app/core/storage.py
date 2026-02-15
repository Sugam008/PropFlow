from typing import Any

import boto3
from botocore.client import Config

from app.core.config import settings


class StorageService:
    def __init__(self) -> None:
        self.s3 = boto3.client(
            "s3",
            endpoint_url=settings.S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4"),
            region_name=settings.AWS_REGION,
        )
        self.bucket = settings.S3_BUCKET

    def upload_file(
        self, file_data: Any, file_key: str, content_type: str | None = None
    ) -> str:
        extra_args = {}
        if content_type:
            extra_args["ContentType"] = content_type

        self.s3.upload_fileobj(file_data, self.bucket, file_key, ExtraArgs=extra_args)
        return self.get_url(file_key)

    def get_url(self, file_key: str) -> str:
        # In production with real S3, this might be a CDN URL or signed URL
        # For local MinIO, we return the direct URL
        if settings.ENVIRONMENT == "local":
            return f"{settings.S3_ENDPOINT_URL}/{self.bucket}/{file_key}"
        return (
            f"https://{self.bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{file_key}"
        )

    def delete_file(self, file_key: str) -> None:
        self.s3.delete_object(Bucket=self.bucket, Key=file_key)


storage_service = StorageService()
