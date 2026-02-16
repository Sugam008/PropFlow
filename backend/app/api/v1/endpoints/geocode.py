import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class GeocodeRequest(BaseModel):
    address: str


class GeocodeResponse(BaseModel):
    lat: float
    lng: float


@router.post("/geocode", response_model=GeocodeResponse)
async def geocode_address(request: GeocodeRequest):
    """
    Geocode an address to lat/lng coordinates.
    Uses Nominatim (OpenStreetMap) via backend to avoid CORS issues.
    """
    if not request.address:
        raise HTTPException(status_code=400, detail="Address is required")

    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "format": "json",
        "q": request.address,
        "limit": 1,
    }
    headers = {
        "User-Agent": "PropFlow/1.0",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()

            if not data or len(data) == 0:
                return None

            return GeocodeResponse(
                lat=float(data[0]["lat"]),
                lng=float(data[0]["lon"]),
            )

    except httpx.TimeoutException as e:
        raise HTTPException(
            status_code=504, detail="Geocoding service timed out. Please try again."
        ) from e
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 403:
            raise HTTPException(
                status_code=503,
                detail="Geocoding service access forbidden. Please try again later.",
            ) from e
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Geocoding service error: {e.response.status_code}",
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Geocoding failed: {str(e)}"
        ) from e


@router.post("/geocode/reverse", response_model=GeocodeResponse)
async def reverse_geocode(lat: float, lng: float):
    """
    Reverse geocode - given lat/lng, get address.
    Uses Nominatim (OpenStreetMap) via backend to avoid CORS issues.
    """
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {
        "format": "json",
        "lat": lat,
        "lon": lng,
        "addressdetails": 1,
    }
    headers = {
        "User-Agent": "PropFlow/1.0",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()

            if not data or "lat" not in data:
                raise HTTPException(
                    status_code=404, detail="No address found for these coordinates."
                )

            return GeocodeResponse(
                lat=float(data["lat"]),
                lng=float(data["lon"]),
            )

    except httpx.TimeoutException as e:
        raise HTTPException(
            status_code=504, detail="Geocoding service timed out. Please try again."
        ) from e
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Geocoding service error: {e.response.status_code}",
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Geocoding failed: {str(e)}"
        ) from e
