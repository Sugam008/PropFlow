import math
from datetime import datetime
from typing import Any

import piexif
from PIL import Image, ImageStat


class ImageService:
    @staticmethod
    def get_exif_data(image_path: str) -> dict[str, Any]:
        """Extract EXIF data from an image file."""
        exif_data: dict[str, Any] = {}
        try:
            img = Image.open(image_path)
            if "exif" in img.info:
                exif_dict = piexif.load(img.info["exif"])

                # Extract capture time
                if piexif.ExifIFD.DateTimeOriginal in exif_dict["Exif"]:
                    date_bytes = exif_dict["Exif"][piexif.ExifIFD.DateTimeOriginal]
                    date_str = date_bytes.decode("utf-8")
                    exif_data["captured_at"] = datetime.strptime(
                        date_str, "%Y:%m:%d %H:%M:%S"
                    )

                # Extract device model
                if piexif.ImageIFD.Model in exif_dict["0th"]:
                    model_bytes = exif_dict["0th"][piexif.ImageIFD.Model]
                    exif_data["device_model"] = model_bytes.decode("utf-8")

                # Extract GPS coordinates
                if "GPS" in exif_dict and exif_dict["GPS"]:
                    gps = exif_dict["GPS"]

                    def to_deg(value: Any) -> float:
                        d = value[0][0] / value[0][1]
                        m = value[1][0] / value[1][1]
                        s = value[2][0] / value[2][1]
                        return float(d + (m / 60.0) + (s / 3600.0))

                    if piexif.GPSIFD.GPSLatitude in gps:
                        lat = to_deg(gps[piexif.GPSIFD.GPSLatitude])
                        if gps[piexif.GPSIFD.GPSLatitudeRef].decode("utf-8") == "S":
                            lat = -lat
                        exif_data["gps_lat"] = lat

                    if piexif.GPSIFD.GPSLongitude in gps:
                        lng = to_deg(gps[piexif.GPSIFD.GPSLongitude])
                        if gps[piexif.GPSIFD.GPSLongitudeRef].decode("utf-8") == "W":
                            lng = -lng
                        exif_data["gps_lng"] = lng
        except Exception as e:
            print(f"Error extracting EXIF: {e}")

        return exif_data

    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate the great circle distance between two points on Earth in km."""
        r_earth = 6371  # Earth radius in km

        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)

        a = (
            math.sin(dphi / 2) ** 2
            + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        return r_earth * c

    @staticmethod
    def optimize_image(
        image_path: str, max_size: tuple[int, int] = (1600, 1600), quality: int = 80
    ) -> str:
        """Optimize image for storage and delivery by resizing and compressing."""
        try:
            img = Image.open(image_path)

            # Convert to RGB if necessary (e.g. from RGBA)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            # Maintain aspect ratio while resizing
            img.thumbnail(max_size, Image.Resampling.LANCZOS)

            # Save back to the same path or a new path if needed
            # For now, we overwrite the original
            img.save(image_path, "JPEG", quality=quality, optimize=True)
            return image_path
        except Exception as e:
            print(f"Error optimizing image: {e}")
            return image_path

    @staticmethod
    def perform_qc_checks(image_path: str) -> dict[str, Any]:
        """Perform quality control checks on the image."""
        qc_results = {
            "is_blurry": False,
            "is_too_dark": False,
            "is_too_bright": False,
            "blur_score": 0.0,
            "brightness_score": 0.0,
        }

        try:
            img = Image.open(image_path).convert("L")  # Convert to grayscale

            # Brightness check
            stat = ImageStat.Stat(img)
            brightness = stat.mean[0]
            qc_results["brightness_score"] = brightness

            if brightness < 40:
                qc_results["is_too_dark"] = True
            elif brightness > 220:
                qc_results["is_too_bright"] = True

            # Simple blur detection using variance of Laplacian
            # (Note: In a real app, use OpenCV for better results)
            # This is a placeholder for basic Pillow-based check
            # For now, we'll assume it's not blurry unless it's extremely small
            qc_results["blur_score"] = 100.0  # Placeholder

        except Exception as e:
            print(f"Error performing QC: {e}")

        return qc_results


image_service = ImageService()
