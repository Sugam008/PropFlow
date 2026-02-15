import io
import logging
from typing import Any

import boto3
from botocore.client import Config
from PIL import Image

from app.core.config import settings

logger = logging.getLogger(__name__)


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
        extra_args: dict[str, str] = {}
        if content_type:
            extra_args["ContentType"] = content_type

        if isinstance(file_data, bytes):
            file_data = io.BytesIO(file_data)
        elif isinstance(file_data, str):
            with open(file_data, "rb") as f:
                file_data = io.BytesIO(f.read())

        self.s3.upload_fileobj(file_data, self.bucket, file_key, ExtraArgs=extra_args)
        return self.get_url(file_key)

    def upload_image(
        self,
        file_data: Any,
        file_key: str,
        optimize: bool = True,
        quality: int = 85,
        max_size: tuple[int, int] = (1920, 1920),
    ) -> str:
        """Upload and optionally optimize an image."""
        try:
            if isinstance(file_data, bytes):
                img_data = io.BytesIO(file_data)
            elif isinstance(file_data, str):
                with open(file_data, "rb") as f:
                    img_data = io.BytesIO(f.read())
            else:
                img_data = file_data

            img = Image.open(img_data)

            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            img.thumbnail(max_size, Image.Resampling.LANCZOS)

            output = io.BytesIO()
            img.save(output, format="JPEG", quality=quality, optimize=True)
            output.seek(0)

            self.s3.upload_fileobj(
                output,
                self.bucket,
                file_key,
                ExtraArgs={"ContentType": "image/jpeg"},
            )
            return self.get_url(file_key)

        except ImportError:
            logger.warning("PIL not available, uploading without optimization")
            return self.upload_file(file_data, file_key, "image/jpeg")

    def generate_thumbnail(
        self, source_key: str, thumbnail_key: str, size: tuple[int, int] = (300, 300)
    ) -> str:
        """Generate and upload a thumbnail version of an image."""
        try:
            response = self.s3.get_object(Bucket=self.bucket, Key=source_key)
            img_data = response["Body"].read()

            img = Image.open(io.BytesIO(img_data))
            img.thumbnail(size, Image.Resampling.LANCZOS)

            output = io.BytesIO()
            img.save(output, format="JPEG", quality=75)
            output.seek(0)

            self.s3.upload_fileobj(
                output,
                self.bucket,
                thumbnail_key,
                ExtraArgs={"ContentType": "image/jpeg"},
            )
            return self.get_url(thumbnail_key)

        except Exception as e:
            logger.error("Error generating thumbnail: %s", e)
            raise

    def get_url(self, file_key: str) -> str:
        if settings.ENVIRONMENT == "local":
            return f"{settings.S3_ENDPOINT_URL}/{self.bucket}/{file_key}"
        return (
            f"https://{self.bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{file_key}"
        )

    def get_presigned_url(self, file_key: str, expires_in: int = 3600) -> str:
        """Generate a presigned URL for temporary access."""
        return self.s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": file_key},
            ExpiresIn=expires_in,
        )

    def get_presigned_upload_url(
        self, file_key: str, content_type: str, expires_in: int = 3600
    ) -> dict[str, str]:
        """Generate a presigned URL for direct client uploads."""
        presigned_url = self.s3.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": self.bucket,
                "Key": file_key,
                "ContentType": content_type,
            },
            ExpiresIn=expires_in,
        )
        return {"url": presigned_url, "key": file_key}

    def delete_file(self, file_key: str) -> None:
        self.s3.delete_object(Bucket=self.bucket, Key=file_key)

    def delete_prefix(self, prefix: str) -> int:
        """Delete all objects with a given prefix."""
        response = self.s3.list_objects_v2(Bucket=self.bucket, Prefix=prefix)
        if "Contents" not in response:
            return 0

        keys = [{"Key": obj["Key"]} for obj in response["Contents"]]
        self.s3.delete_objects(
            Bucket=self.bucket, Delete={"Objects": keys, "Quiet": True}
        )
        return len(keys)

    def copy_file(self, source_key: str, destination_key: str) -> str:
        """Copy a file within the bucket."""
        copy_source = {"Bucket": self.bucket, "Key": source_key}
        self.s3.copy_object(
            Bucket=self.bucket, Key=destination_key, CopySource=copy_source
        )
        return self.get_url(destination_key)


storage_service = StorageService()
