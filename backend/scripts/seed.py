#!/usr/bin/env python3
"""
PropFlow Database Seed Script

Creates initial seed data for development:
- 3 users (customer, valuer, admin)
- 3 properties with different statuses
- 6 photos per property
- 5 comparables
- 1 valuation

Usage:
    python scripts/seed.py
"""

from datetime import datetime, timedelta

from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models.audit_log import AuditLog
from app.models.comp import Comparable
from app.models.photo import PhotoType, PropertyPhoto, QCStatus
from app.models.property import Property, PropertyStatus, PropertyType
from app.models.user import User, UserRole
from app.models.valuation import Valuation

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

BENGALURU_PROPERTIES = [
    {
        "address": "204, Tower A, Embassy Prime",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560045",
        "lat": 13.0225,
        "lng": 77.5706,
        "property_type": PropertyType.APARTMENT,
        "area_sqft": 1200,
        "bedrooms": 2,
        "bathrooms": 2,
        "floor": 2,
        "total_floors": 12,
        "age": 5,
    },
    {
        "address": "45, MG Road Layout",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560001",
        "lat": 12.9755,
        "lng": 77.6063,
        "property_type": PropertyType.APARTMENT,
        "area_sqft": 1800,
        "bedrooms": 3,
        "bathrooms": 2,
        "floor": 5,
        "total_floors": 10,
        "age": 8,
    },
    {
        "address": "12, Whitefield Main Road",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560066",
        "lat": 12.9698,
        "lng": 77.7499,
        "property_type": PropertyType.VILLA,
        "area_sqft": 2500,
        "bedrooms": 4,
        "bathrooms": 3,
        "floor": 1,
        "total_floors": 2,
        "age": 3,
    },
]

COMPARABLES = [
    {
        "address": "105, Embassy Tech Village",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560045",
        "lat": 13.0230,
        "lng": 77.5710,
        "area_sqft": 1150,
        "sale_price": 8500000,
        "sale_date": datetime.now() - timedelta(days=30),
        "distance_km": 0.3,
    },
    {
        "address": "302, Brigade Metropolis",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560045",
        "lat": 13.0240,
        "lng": 77.5720,
        "area_sqft": 1250,
        "sale_price": 9200000,
        "sale_date": datetime.now() - timedelta(days=45),
        "distance_km": 0.5,
    },
    {
        "address": "88, Ultra Home",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560001",
        "lat": 12.9760,
        "lng": 77.6070,
        "area_sqft": 1750,
        "sale_price": 12500000,
        "sale_date": datetime.now() - timedelta(days=60),
        "distance_km": 0.8,
    },
    {
        "address": "201, Prestige Forum",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560066",
        "lat": 12.9700,
        "lng": 77.7500,
        "area_sqft": 2400,
        "sale_price": 18000000,
        "sale_date": datetime.now() - timedelta(days=20),
        "distance_km": 0.4,
    },
    {
        "address": "56, Villa Retreat",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560066",
        "lat": 12.9710,
        "lng": 77.7510,
        "area_sqft": 2600,
        "sale_price": 19500000,
        "sale_date": datetime.now() - timedelta(days=15),
        "distance_km": 0.6,
    },
]


def create_tables() -> None:
    """Create all database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")


def seed_users(db: Session) -> dict[UserRole, User]:
    """Create seed users."""
    print("Seeding users...")

    users_data = [
        {
            "phone": "+919999900001",
            "email": "customer@propflow.demo",
            "name": "Demo Customer",
            "role": UserRole.CUSTOMER,
            "password": "demo123",
        },
        {
            "phone": "+919999900002",
            "email": "valuer@propflow.demo",
            "name": "Demo Valuer",
            "role": UserRole.VALUER,
            "password": "demo123",
        },
        {
            "phone": "+919999900003",
            "email": "admin@propflow.demo",
            "name": "Demo Admin",
            "role": UserRole.ADMIN,
            "password": "demo123",
        },
    ]

    users: dict[UserRole, User] = {}
    for user_data in users_data:
        password = user_data.pop("password")
        user_data["hashed_password"] = pwd_context.hash(password)

        existing = db.execute(
            select(User).where(User.phone == user_data["phone"])
        ).scalar_one_or_none()

        if existing:
            users[user_data["role"]] = existing
            print(f"  User {user_data['role'].value} already exists")
        else:
            user = User(**user_data)
            db.add(user)
            db.flush()
            users[user_data["role"]] = user
            print(f"  Created user: {user.email} ({user.role.value})")

    db.commit()
    return users


def seed_properties(db: Session, users: dict[UserRole, User]) -> list[Property]:
    """Create seed properties."""
    print("Seeding properties...")

    customer = users[UserRole.CUSTOMER]
    valuer = users[UserRole.VALUER]

    properties = []
    statuses = [
        PropertyStatus.DRAFT,
        PropertyStatus.SUBMITTED,
        PropertyStatus.UNDER_REVIEW,
    ]

    for i, prop_data in enumerate(BENGALURU_PROPERTIES):
        existing = db.execute(
            select(Property).where(Property.address == prop_data["address"])
        ).scalar_one_or_none()

        if existing:
            properties.append(existing)
            print(f"  Property already exists: {existing.address}")
            continue

        property_obj = Property(
            user_id=customer.id,
            status=statuses[i],
            description=(
                f"Beautiful {prop_data['property_type'].value.lower()} in "
                f"{prop_data['city']}"
            ),
            estimated_value=prop_data["area_sqft"] * 7500,
            submitted_at=datetime.now() - timedelta(days=2) if i > 0 else None,
            reviewed_at=datetime.now() - timedelta(days=1) if i == 2 else None,
            valuer_id=valuer.id if i == 2 else None,
            **prop_data,
        )
        db.add(property_obj)
        properties.append(property_obj)
        print(f"  Created property: {property_obj.address}")

    db.commit()
    return properties


def seed_photos(db: Session, properties: list[Property]) -> None:
    """Create seed photos for properties."""
    print("Seeding photos...")

    photo_types = [
        PhotoType.EXTERIOR,
        PhotoType.INTERIOR,
        PhotoType.INTERIOR,
        PhotoType.INTERIOR,
        PhotoType.INTERIOR,
        PhotoType.OTHER,
    ]

    for _i, prop in enumerate(properties):
        existing_photos = (
            db.execute(
                select(PropertyPhoto).where(PropertyPhoto.property_id == prop.id)
            )
            .scalars()
            .all()
        )

        if existing_photos:
            print(f"  Photos already exist for property: {prop.address}")
            continue

        for j, photo_type in enumerate(photo_types):
            photo = PropertyPhoto(
                property_id=prop.id,
                s3_key=f"seed/{prop.id}/photo_{j}.jpg",
                s3_url=f"http://localhost:9000/propflow-uploads/seed/{prop.id}/photo_{j}.jpg",
                photo_type=photo_type,
                sequence=j,
                captured_at=datetime.now() - timedelta(days=1),
                gps_lat=prop.lat,
                gps_lng=prop.lng,
                device_model="iPhone 14 Pro",
                qc_status=QCStatus.APPROVED if j < 4 else QCStatus.PENDING,
            )
            db.add(photo)

        print(f"  Created 6 photos for property: {prop.address}")

    db.commit()


def seed_comparables(db: Session) -> list[Comparable]:
    """Create seed comparables."""
    print("Seeding comparables...")

    comparables = []

    for comp_data in COMPARABLES:
        existing = db.execute(
            select(Comparable).where(Comparable.address == comp_data["address"])
        ).scalar_one_or_none()

        if existing:
            comparables.append(existing)
            print(f"  Comparable already exists: {existing.address}")
            continue

        comp = Comparable(
            **comp_data,
            source_url="https://example.com/property-data",
            description=f"Comparable property at {comp_data['address']}",
        )
        db.add(comp)
        comparables.append(comp)
        print(f"  Created comparable: {comp.address}")

    db.commit()
    return comparables


def seed_valuations(
    db: Session,
    properties: list[Property],
    users: dict[UserRole, User],
    comparables: list[Comparable],
) -> None:
    """Create seed valuations."""
    print("Seeding valuations...")

    valuer = users[UserRole.VALUER]

    for _i, prop in enumerate(properties):
        if prop.status != PropertyStatus.UNDER_REVIEW:
            continue

        existing = db.execute(
            select(Valuation).where(Valuation.property_id == prop.id)
        ).scalar_one_or_none()

        if existing:
            print(f"  Valuation already exists for property: {prop.address}")
            continue

        valuation = Valuation(
            property_id=prop.id,
            valuer_id=valuer.id,
            estimated_value=prop.estimated_value or 15000000,
            confidence_score=0.85,
            valuation_date=datetime.now(),
            methodology="comparative",
            comp1_id=comparables[3].id if len(comparables) > 3 else None,
            comp2_id=comparables[4].id if len(comparables) > 4 else None,
            comp3_id=None,
            notes=(
                "Property is in good condition. "
                "Comparable properties in the area support the valuation."
            ),
        )
        db.add(valuation)
        print(f"  Created valuation for property: {prop.address}")

    db.commit()


def seed_audit_logs(
    db: Session, properties: list[Property], users: dict[UserRole, User]
) -> None:
    """Create seed audit logs."""
    print("Seeding audit logs...")

    customer = users[UserRole.CUSTOMER]

    for prop in properties:
        existing_logs = (
            db.execute(
                select(AuditLog).where(
                    AuditLog.entity_type == "property",
                    AuditLog.entity_id == prop.id,
                )
            )
            .scalars()
            .all()
        )

        if existing_logs:
            continue

        log = AuditLog(
            entity_type="property",
            entity_id=prop.id,
            action="created",
            old_value=None,
            new_value={"status": prop.status.value},
            actor_id=customer.id,
        )
        db.add(log)

    db.commit()
    print("  Audit logs created")


def run_seed() -> None:
    """Run the complete seed process."""
    print("\n" + "=" * 50)
    print("PropFlow Database Seeder")
    print("=" * 50 + "\n")

    create_tables()

    db = SessionLocal()
    try:
        users = seed_users(db)
        properties = seed_properties(db, users)
        seed_photos(db, properties)
        comparables = seed_comparables(db)
        seed_valuations(db, properties, users, comparables)
        seed_audit_logs(db, properties, users)

        print("\n" + "=" * 50)
        print("Seeding completed successfully!")
        print("=" * 50)
        print("\nDemo Credentials:")
        print("  Customer: +919999900001 / demo123")
        print("  Valuer:   +919999900002 / demo123")
        print("  Admin:    +919999900003 / demo123")
        print()

    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
