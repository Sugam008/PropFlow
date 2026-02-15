from fastapi import APIRouter

from app.api.v1.endpoints import (
    analytics,
    auth,
    comps,
    photos,
    properties,
    users,
    valuations,
    websocket,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(photos.router, prefix="/properties", tags=["photos"])
api_router.include_router(comps.router, prefix="/comps", tags=["comparables"])
api_router.include_router(valuations.router, prefix="/valuations", tags=["valuations"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(websocket.router, tags=["websocket"])
