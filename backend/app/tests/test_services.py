import os
import tempfile
import pytest
from PIL import Image
from app.services.image_service import ImageService

def test_haversine_distance():
    # Distance between London and Paris
    lat1, lon1 = 51.5074, -0.1278
    lat2, lon2 = 48.8566, 2.3522
    distance = ImageService.haversine_distance(lat1, lon1, lat2, lon2)
    # Approx 344 km
    assert 340 < distance < 350

def test_perform_qc_checks_dark():
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        # Create a dark image
        img = Image.new('RGB', (100, 100), color=(10, 10, 10))
        img.save(tmp.name)
        
        qc_results = ImageService.perform_qc_checks(tmp.name)
        assert qc_results["is_too_dark"] is True
        assert qc_results["is_too_bright"] is False
    os.unlink(tmp.name)

def test_perform_qc_checks_bright():
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        # Create a bright image
        img = Image.new('RGB', (100, 100), color=(240, 240, 240))
        img.save(tmp.name)
        
        qc_results = ImageService.perform_qc_checks(tmp.name)
        assert qc_results["is_too_bright"] is True
        assert qc_results["is_too_dark"] is False
    os.unlink(tmp.name)

def test_perform_qc_checks_normal():
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        # Create a normal image
        img = Image.new('RGB', (100, 100), color=(128, 128, 128))
        img.save(tmp.name)
        
        qc_results = ImageService.perform_qc_checks(tmp.name)
        assert qc_results["is_too_bright"] is False
        assert qc_results["is_too_dark"] is False
    os.unlink(tmp.name)

import piexif
from datetime import datetime

def test_get_exif_data_with_exif():
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        img = Image.new('RGB', (100, 100), color=(128, 128, 128))
        
        # Create EXIF data
        zeroth_ifd = {
            piexif.ImageIFD.Make: u"Canon",
            piexif.ImageIFD.Model: u"EOS 5D Mark IV",
        }
        exif_ifd = {
            piexif.ExifIFD.DateTimeOriginal: u"2023:01:01 12:00:00",
        }
        gps_ifd = {
            piexif.GPSIFD.GPSLatitudeRef: "N",
            piexif.GPSIFD.GPSLatitude: ((40, 1), (30, 1), (0, 1)),
            piexif.GPSIFD.GPSLongitudeRef: "E",
            piexif.GPSIFD.GPSLongitude: ((70, 1), (20, 1), (0, 1)),
        }
        exif_dict = {"0th": zeroth_ifd, "Exif": exif_ifd, "GPS": gps_ifd}
        exif_bytes = piexif.dump(exif_dict)
        
        img.save(tmp.name, exif=exif_bytes)
        
        exif_data = ImageService.get_exif_data(tmp.name)
        assert exif_data["device_model"] == "EOS 5D Mark IV"
        assert isinstance(exif_data["captured_at"], datetime)
        assert exif_data["gps_lat"] == 40.5
        assert exif_data["gps_lng"] == 70.33333333333333
    os.unlink(tmp.name)
