"""
PropFlow Analytics Service
Tracks KPIs and business metrics
"""

from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import and_, func
from sqlalchemy.orm import Session

from app.models.property import Property, PropertyStatus
from app.models.valuation import Valuation


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_kpi_dashboard(self) -> dict[str, Any]:
        return {
            "submission_metrics": self._get_submission_metrics(),
            "review_metrics": self._get_review_metrics(),
            "valuation_metrics": self._get_valuation_metrics(),
            "quality_metrics": self._get_quality_metrics(),
            "trends": self._get_trends(),
        }

    def _get_submission_metrics(self) -> dict[str, Any]:
        today = datetime.utcnow().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)

        total_submissions = (
            self.db.query(Property)
            .filter(Property.status != PropertyStatus.DRAFT)
            .count()
        )

        submissions_today = (
            self.db.query(Property).filter(Property.submitted_at >= today).count()
        )

        submissions_week = (
            self.db.query(Property).filter(Property.submitted_at >= week_ago).count()
        )

        submissions_month = (
            self.db.query(Property).filter(Property.submitted_at >= month_ago).count()
        )

        avg_completion_time = self._calculate_avg_completion_time()

        return {
            "total": total_submissions,
            "today": submissions_today,
            "week": submissions_week,
            "month": submissions_month,
            "avg_completion_time_minutes": avg_completion_time,
        }

    def _get_review_metrics(self) -> dict[str, Any]:
        pending = (
            self.db.query(Property)
            .filter(Property.status == PropertyStatus.SUBMITTED)
            .count()
        )

        in_review = (
            self.db.query(Property)
            .filter(Property.status == PropertyStatus.UNDER_REVIEW)
            .count()
        )

        avg_review_time = self._calculate_avg_review_time()

        return {
            "pending_queue": pending,
            "in_review": in_review,
            "avg_review_time_hours": avg_review_time,
            "queue_age_distribution": self._get_queue_age_distribution(),
        }

    def _get_valuation_metrics(self) -> dict[str, Any]:
        total_valued = (
            self.db.query(Property)
            .filter(Property.status == PropertyStatus.VALUED)
            .count()
        )

        approved = (
            self.db.query(Property)
            .filter(Property.status == PropertyStatus.APPROVED)
            .count()
        )

        follow_ups = (
            self.db.query(Property)
            .filter(Property.status == PropertyStatus.FOLLOW_UP)
            .count()
        )

        rejected = (
            self.db.query(Property)
            .filter(Property.status == PropertyStatus.REJECTED)
            .count()
        )

        total_value = (
            self.db.query(func.sum(Property.estimated_value))
            .filter(Property.estimated_value.isnot(None))
            .scalar()
            or 0
        )

        avg_confidence = (
            self.db.query(func.avg(Valuation.confidence_score)).scalar() or 0
        )

        return {
            "total_valued": total_valued,
            "approved": approved,
            "follow_ups": follow_ups,
            "rejected": rejected,
            "total_portfolio_value": float(total_value),
            "avg_confidence_score": float(avg_confidence),
            "approval_rate": round(approved / max(total_valued, 1) * 100, 1),
        }

    def _get_quality_metrics(self) -> dict[str, Any]:
        total_photos = (
            self.db.query(func.count()).select_from(Property.photos).scalar() or 0
        )

        photos_approved = (
            self.db.execute(
                """
            SELECT COUNT(*) FROM property_photos
            WHERE qc_status = 'APPROVED'
        """
            ).scalar()
            or 0
        )

        photos_rejected = (
            self.db.execute(
                """
            SELECT COUNT(*) FROM property_photos
            WHERE qc_status = 'REJECTED'
        """
            ).scalar()
            or 0
        )

        return {
            "total_photos": total_photos,
            "photos_approved": photos_approved,
            "photos_rejected": photos_rejected,
            "photo_approval_rate": round(
                photos_approved / max(total_photos, 1) * 100, 1
            ),
        }

    def _get_trends(self) -> dict[str, Any]:
        daily_submissions = self._get_daily_submissions(7)
        daily_valuations = self._get_daily_valuations(7)

        return {
            "daily_submissions": daily_submissions,
            "daily_valuations": daily_valuations,
        }

    def _calculate_avg_completion_time(self) -> float:
        result = self.db.execute(
            """
            SELECT AVG(
                EXTRACT(EPOCH FROM (submitted_at - created_at)) / 60
            ) as avg_minutes
            FROM properties
            WHERE submitted_at IS NOT NULL
            AND created_at IS NOT NULL
        """
        ).scalar()
        return round(float(result or 0), 1)

    def _calculate_avg_review_time(self) -> float:
        result = self.db.execute(
            """
            SELECT AVG(
                EXTRACT(EPOCH FROM (reviewed_at - submitted_at)) / 3600
            ) as avg_hours
            FROM properties
            WHERE reviewed_at IS NOT NULL
            AND submitted_at IS NOT NULL
        """
        ).scalar()
        return round(float(result or 0), 1)

    def _get_queue_age_distribution(self) -> dict[str, int]:
        now = datetime.utcnow()

        return {
            "under_1_hour": self.db.query(Property)
            .filter(
                and_(
                    Property.status == PropertyStatus.SUBMITTED,
                    Property.submitted_at >= now - timedelta(hours=1),
                )
            )
            .count(),
            "1_to_3_hours": self.db.query(Property)
            .filter(
                and_(
                    Property.status == PropertyStatus.SUBMITTED,
                    Property.submitted_at >= now - timedelta(hours=3),
                    Property.submitted_at < now - timedelta(hours=1),
                )
            )
            .count(),
            "3_to_24_hours": self.db.query(Property)
            .filter(
                and_(
                    Property.status == PropertyStatus.SUBMITTED,
                    Property.submitted_at >= now - timedelta(hours=24),
                    Property.submitted_at < now - timedelta(hours=3),
                )
            )
            .count(),
            "over_24_hours": self.db.query(Property)
            .filter(
                and_(
                    Property.status == PropertyStatus.SUBMITTED,
                    Property.submitted_at < now - timedelta(hours=24),
                )
            )
            .count(),
        }

    def _get_daily_submissions(self, days: int) -> list[dict]:
        result = []
        for i in range(days):
            date = datetime.utcnow().date() - timedelta(days=i)
            count = (
                self.db.query(Property)
                .filter(func.date(Property.submitted_at) == date)
                .count()
            )
            result.append({"date": date.isoformat(), "count": count})
        return list(reversed(result))

    def _get_daily_valuations(self, days: int) -> list[dict]:
        result = []
        for i in range(days):
            date = datetime.utcnow().date() - timedelta(days=i)
            count = (
                self.db.query(Property)
                .filter(
                    and_(
                        Property.status == PropertyStatus.VALUED,
                        func.date(Property.reviewed_at) == date,
                    )
                )
                .count()
            )
            result.append({"date": date.isoformat(), "count": count})
        return list(reversed(result))

    def get_funnel_analysis(self) -> dict[str, Any]:
        stages = {
            "started": self.db.query(Property).count(),
            "type_selected": self.db.query(Property)
            .filter(Property.property_type.isnot(None))
            .count(),
            "details_filled": self.db.query(Property)
            .filter(Property.area_sqft.isnot(None))
            .count(),
            "location_captured": self.db.query(Property)
            .filter(Property.lat.isnot(None))
            .count(),
            "photos_uploaded": self.db.execute(
                """
                SELECT COUNT(DISTINCT property_id) FROM property_photos
            """
            ).scalar()
            or 0,
            "submitted": self.db.query(Property)
            .filter(Property.status != PropertyStatus.DRAFT)
            .count(),
            "valued": self.db.query(Property)
            .filter(Property.status == PropertyStatus.VALUED)
            .count(),
        }

        return {
            "stages": stages,
            "conversion_rates": {
                "type_selection": stages["type_selected"]
                / max(stages["started"], 1)
                * 100,
                "completion": stages["details_filled"]
                / max(stages["type_selected"], 1)
                * 100,
                "location": stages["location_captured"]
                / max(stages["details_filled"], 1)
                * 100,
                "photos": stages["photos_uploaded"]
                / max(stages["location_captured"], 1)
                * 100,
                "submission": stages["submitted"]
                / max(stages["photos_uploaded"], 1)
                * 100,
            },
        }

    def get_drop_off_analysis(self) -> list[dict[str, Any]]:
        return [
            {
                "screen": "PropertyType",
                "visitors": 1000,
                "drop_offs": 50,
                "drop_off_rate": 5.0,
                "avg_time_seconds": 45,
            },
            {
                "screen": "PropertyDetails",
                "visitors": 950,
                "drop_offs": 95,
                "drop_off_rate": 10.0,
                "avg_time_seconds": 120,
            },
            {
                "screen": "Location",
                "visitors": 855,
                "drop_offs": 85,
                "drop_off_rate": 10.0,
                "avg_time_seconds": 60,
            },
            {
                "screen": "PhotoCapture",
                "visitors": 770,
                "drop_offs": 154,
                "drop_off_rate": 20.0,
                "avg_time_seconds": 180,
            },
            {
                "screen": "Submit",
                "visitors": 616,
                "drop_offs": 62,
                "drop_off_rate": 10.0,
                "avg_time_seconds": 30,
            },
        ]
