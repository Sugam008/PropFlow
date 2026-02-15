from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/dashboard")
def get_kpi_dashboard(
    db: Session = Depends(deps.get_db),
    _: None = Depends(deps.get_current_active_user),
):
    analytics = AnalyticsService(db)
    return analytics.get_kpi_dashboard()


@router.get("/funnel")
def get_funnel_analysis(
    db: Session = Depends(deps.get_db),
    _: None = Depends(deps.get_current_active_user),
):
    analytics = AnalyticsService(db)
    return analytics.get_funnel_analysis()


@router.get("/drop-off")
def get_drop_off_analysis(
    db: Session = Depends(deps.get_db),
    _: None = Depends(deps.get_current_active_user),
):
    analytics = AnalyticsService(db)
    return analytics.get_drop_off_analysis()
