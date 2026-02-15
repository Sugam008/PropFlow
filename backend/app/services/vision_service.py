import logging
from typing import Any

from app.core.config import settings

logger = logging.getLogger(__name__)


class VisionService:
    """Service for Google Vision API integration."""

    def __init__(self) -> None:
        self.api_key = getattr(settings, "GOOGLE_VISION_API_KEY", None)
        self.enabled = bool(self.api_key)

    def _make_request(self, image_content: bytes) -> dict[str, Any] | None:
        """Make request to Google Vision API."""
        if not self.enabled:
            logger.info("Google Vision API not configured, skipping")
            return None

        try:
            import requests

            url = f"https://vision.googleapis.com/v1/images:annotate?key={self.api_key}"

            requests.post(
                url,
                json={
                    "requests": [
                        {
                            "image": {"content": self._encode_base64(image_content)},
                            "features": [
                                {"type": "LABEL_DETECTION", "maxResults": 10},
                                {"type": "SAFE_SEARCH_DETECTION"},
                                {"type": "TEXT_DETECTION"},
                            ],
                        }
                    ]
                },
            )
        except ImportError:
            logger.warning("requests library not available")
            return None
        except Exception as e:
            logger.error(f"Vision API error: {e}")
            return None

    def _encode_base64(self, data: bytes) -> str:
        import base64

        return base64.b64encode(data).decode("utf-8")

    def analyze_labels(self, image_content: bytes) -> list[dict[str, Any]]:
        """Get labels/objects detected in the image."""
        if not self.enabled:
            return []

        result = self._make_request(image_content)
        if not result:
            return []

        labels = []
        for response in result.get("responses", []):
            for label in response.get("labelAnnotations", []):
                labels.append(
                    {
                        "description": label.get("description"),
                        "score": label.get("score", 0),
                        "topicality": label.get("topicality", 0),
                    }
                )

        return labels

    def check_safe_search(self, image_content: bytes) -> dict[str, str]:
        """Check for unsafe content."""
        if not self.enabled:
            return {"adult": "UNKNOWN", "violence": "UNKNOWN"}

        result = self._make_request(image_content)
        if not result:
            return {"adult": "UNKNOWN", "violence": "UNKNOWN"}

        for response in result.get("responses", []):
            safe = response.get("safeSearchAnnotation", {})
            return {
                "adult": safe.get("adult", "UNKNOWN"),
                "violence": safe.get("violence", "UNKNOWN"),
                "racy": safe.get("racy", "UNKNOWN"),
            }

        return {"adult": "UNKNOWN", "violence": "UNKNOWN"}

    def extract_text(self, image_content: bytes) -> str:
        """Extract text from image (OCR)."""
        if not self.enabled:
            return ""

        result = self._make_request(image_content)
        if not result:
            return ""

        for response in result.get("responses", []):
            text_annotations = response.get("textAnnotations", [])
            if text_annotations:
                return text_annotations[0].get("description", "")

        return ""

    def is_safe(self, image_content: bytes) -> bool:
        """Check if image is safe for property photos."""
        safe_search = self.check_safe_search(image_content)

        adult_level = safe_search.get("adult", "UNKNOWN")
        violence_level = safe_search.get("violence", "UNKNOWN")

        unsafe_levels = ["LIKELY", "VERY_LIKELY"]

        if adult_level in unsafe_levels or violence_level in unsafe_levels:
            return False

        return True

    def analyze_property_photo(self, image_content: bytes) -> dict[str, Any]:
        """Comprehensive property photo analysis."""
        if not self.enabled:
            return {
                "enabled": False,
                "labels": [],
                "safe": True,
                "text": "",
            }

        labels = self.analyze_labels(image_content)
        safe = self.is_safe(image_content)
        text = self.extract_text(image_content)

        return {
            "enabled": True,
            "labels": labels,
            "safe": safe,
            "text": text,
            "has_text": bool(text),
        }


vision_service = VisionService()
