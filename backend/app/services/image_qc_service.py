import io
import logging
from typing import Any

from PIL import Image, ImageStat

logger = logging.getLogger(__name__)


class ImageQCService:
    """Service for performing quality control checks on images."""

    BLUR_THRESHOLD = 30
    BRIGHTNESS_MIN = 40
    BRIGHTNESS_MAX = 220
    GLARE_THRESHOLD = 70

    def __init__(self) -> None:
        self.blur_threshold = self.BLUR_THRESHOLD
        self.brightness_min = self.BRIGHTNESS_MIN
        self.brightness_max = self.BRIGHTNESS_MAX
        self.glare_threshold = self.GLARE_THRESHOLD

    def check_blur(self, image_data: bytes | str | io.BytesIO) -> dict[str, Any]:
        """
        Check if image is blurry using Laplacian variance.
        Lower variance = more blurry.
        """
        result = {"is_blurry": False, "score": 0.0, "threshold": self.blur_threshold}

        try:
            img = self._open_image(image_data)
            img_gray = img.convert("L")

            import numpy as np

            img_array = np.array(img_gray)

            laplacian_kernel = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]])

            rows, cols = img_array.shape
            laplacian = np.zeros_like(img_array, dtype=np.float64)

            for i in range(1, rows - 1):
                for j in range(1, cols - 1):
                    region = img_array[i - 1 : i + 2, j - 1 : j + 2]
                    laplacian[i, j] = np.sum(region * laplacian_kernel)

            variance = laplacian.var()
            result["score"] = float(variance)
            result["is_blurry"] = variance < self.blur_threshold

        except ImportError:
            result["error"] = "numpy not available, using fallback"
            result["score"] = self._fallback_blur_check(image_data)
            result["is_blurry"] = result["score"] < self.blur_threshold
        except Exception as e:
            logger.error("Error checking blur: %s", e)
            result["error"] = str(e)

        return result

    def _open_image(self, image_data: bytes | str | io.BytesIO) -> Image.Image:
        """Helper to open image from various sources."""
        if isinstance(image_data, str):
            with open(image_data, "rb") as f:
                image_data = io.BytesIO(f.read())
        elif isinstance(image_data, bytes):
            image_data = io.BytesIO(image_data)
        return Image.open(image_data)

    def _fallback_blur_check(self, image_data: bytes | str | io.BytesIO) -> float:
        """Fallback blur check without numpy."""
        try:
            img = Image.open(image_data).convert("L")
            img = img.resize((100, 100))
            pixels = list(img.getdata())

            edges = 0
            for i in range(1, 99):
                for j in range(1, 99):
                    idx = i * 100 + j
                    neighbors = [
                        pixels[idx - 1],
                        pixels[idx + 1],
                        pixels[idx - 100],
                        pixels[idx + 100],
                    ]
                    if abs(pixels[idx] - sum(neighbors) / 4) > 10:
                        edges += 1

            return float(edges)
        except Exception:
            return 100.0

    def check_brightness(self, image_data: bytes | str | io.BytesIO) -> dict[str, Any]:
        """
        Check image brightness.
        Returns mean brightness score and whether it's too dark/bright.
        """
        result = {
            "is_too_dark": False,
            "is_too_bright": False,
            "score": 0.0,
            "min": self.brightness_min,
            "max": self.brightness_max,
        }

        try:
            if isinstance(image_data, str):
                with open(image_data, "rb") as f:
                    image_data = io.BytesIO(f.read())

            img = Image.open(image_data).convert("L")
            stat = ImageStat.Stat(img)
            brightness = stat.mean[0]

            result["score"] = float(brightness)
            result["is_too_dark"] = brightness < self.brightness_min
            result["is_too_bright"] = brightness > self.brightness_max

        except Exception as e:
            result["error"] = str(e)

        return result

    def check_glare(self, image_data: bytes | str | io.BytesIO) -> dict[str, Any]:
        """
        Check for glare/overexposed areas in the image.
        """
        result = {
            "has_glare": False,
            "percentage": 0.0,
            "threshold": self.glare_threshold,
        }

        try:
            if isinstance(image_data, str):
                with open(image_data, "rb") as f:
                    image_data = io.BytesIO(f.read())

            img = Image.open(image_data).convert("L")
            img = img.resize((200, 200))
            pixels = list(img.getdata())

            bright_pixels = sum(1 for p in pixels if p > 240)
            total_pixels = len(pixels)
            glare_percentage = (bright_pixels / total_pixels) * 100

            result["percentage"] = float(glare_percentage)
            result["has_glare"] = glare_percentage > self.glare_threshold

        except Exception as e:
            result["error"] = str(e)

        return result

    def run_qc_checks(self, image_data: bytes | str | io.BytesIO) -> dict[str, Any]:
        """
        Run all QC checks and return combined results.
        """
        blur_result = self.check_blur(image_data)
        brightness_result = self.check_brightness(image_data)
        glare_result = self.check_glare(image_data)

        issues = []
        warnings = []

        if blur_result.get("is_blurry"):
            issues.append("Image is blurry")
        elif blur_result.get("score", 100) < self.blur_threshold * 1.5:
            warnings.append("Image may be slightly blurry")

        if brightness_result.get("is_too_dark"):
            issues.append("Image is too dark")
        elif brightness_result.get("is_too_bright"):
            issues.append("Image is too bright")

        if glare_result.get("has_glare"):
            issues.append("Image has glare")
        elif glare_result.get("percentage", 0) > self.glare_threshold / 2:
            warnings.append("Image may have some glare")

        return {
            "passed": len(issues) == 0,
            "issues": issues,
            "warnings": warnings,
            "blur": blur_result,
            "brightness": brightness_result,
            "glare": glare_result,
            "recommendation": "reject"
            if issues
            else ("review" if warnings else "approve"),
        }

    def get_user_message(self, qc_result: dict[str, Any]) -> str:
        """Get user-friendly message based on QC results."""
        issues = qc_result.get("issues", [])

        if "Image is blurry" in issues:
            return (
                "Please retake the photo. "
                "Hold the camera steady and ensure good lighting."
            )
        elif "Image is too dark" in issues:
            return "Please retake the photo in better lighting conditions."
        elif "Image is too bright" in issues:
            return (
                "Please retake the photo. "
                "Avoid pointing the camera directly at bright light sources."
            )
        elif "Image has glare" in issues:
            return (
                "Please retake the photo. "
                "Avoid capturing direct sunlight or reflections."
            )

        warnings = qc_result.get("warnings", [])
        if warnings:
            return (
                "The photo quality could be improved. "
                "You can proceed or retake for better results."
            )

        return "Photo quality looks good!"


image_qc_service = ImageQCService()
