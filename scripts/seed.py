"""
PropFlow Database Seed Script
Creates initial test data for development
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.property import Property, PropertyType, PropertyStatus
from app.models.comp import Comparable
from app.core.security import get_password_hash


def seed_users(db: Session) -> list[User]:
    users = []

    test_users = [
        {
            "phone": "+919876543210",
            "email": "customer@propflow.test",
            "name": "Test Customer",
            "role": UserRole.CUSTOMER,
        },
        {
            "phone": "+919876543211",
            "email": "valuer@propflow.test",
            "name": "Test Valuer",
            "role": UserRole.VALUER,
        },
        {
            "phone": "+919876543212",
            "email": "admin@propflow.test",
            "name": "Test Admin",
            "role": UserRole.ADMIN,
        },
    ]

    for user_data in test_users:
        existing = db.query(User).filter(User.phone == user_data["phone"]).first()
        if existing:
            users.append(existing)
            continue

        user = User(
            phone=user_data["phone"],
            email=user_data["email"],
            name=user_data["name"],
            role=user_data["role"],
            is_active=True,
        )
        db.add(user)
        users.append(user)

    db.commit()
    print(f"✅ Created {len(users)} users")
    return users


def seed_properties(db: Session, users: list[User]) -> list[Property]:
    properties = []

    customer = next((u for u in users if u.role == UserRole.CUSTOMER), users[0])

    test_properties = [
        {
            "property_type": PropertyType.APARTMENT,
            "address": "123, Brigade Metropolis, Whitefield",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560066",
            "area_sqft": 1200,
            "bedrooms": 2,
            "bathrooms": 2,
            "floor": 5,
            "total_floors": 15,
            "age": 5,
            "lat": 12.9698,
            "lng": 77.7500,
            "status": PropertyStatus.SUBMITTED,
        },
        {
            "property_type": PropertyType.APARTMENT,
            "address": "456, Prestige Lakeside, Varthur",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560087",
            "area_sqft": 1500,
            "bedrooms": 3,
            "bathrooms": 3,
            "floor": 10,
            "total_floors": 20,
            "age": 3,
            "lat": 12.9352,
            "lng": 77.7245,
            "status": PropertyStatus.SUBMITTED,
        },
        {
            "property_type": PropertyType.HOUSE,
            "address": "789, Independent House, JP Nagar",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560078",
            "area_sqft": 2400,
            "bedrooms": 4,
            "bathrooms": 4,
            "age": 10,
            "lat": 12.9063,
            "lng": 77.5857,
            "status": PropertyStatus.DRAFT,
        },
    ]

    for prop_data in test_properties:
        existing = (
            db.query(Property).filter(Property.address == prop_data["address"]).first()
        )
        if existing:
            properties.append(existing)
            continue

        property = Property(
            **prop_data,
            owner_id=customer.id,
        )
        db.add(property)
        properties.append(property)

    db.commit()
    print(f"✅ Created {len(properties)} properties")
    return properties


def seed_comparables(db: Session) -> list[Comparable]:
    comps = []

    test_comps = [
        {
            "address": "Brigade Metropolis, Block A",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560066",
            "property_type": PropertyType.APARTMENT,
            "area_sqft": 1150,
            "bedrooms": 2,
            "sale_price": 7200000,
            "sale_date": "2024-06-15",
            "lat": 12.9695,
            "lng": 77.7495,
            "source": "Public Records",
        },
        {
            "address": "Prestige Shantiniketan, Tower B",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560066",
            "property_type": PropertyType.APARTMENT,
            "area_sqft": 1250,
            "bedrooms": 2,
            "sale_price": 7800000,
            "sale_date": "2024-05-20",
            "lat": 12.9700,
            "lng": 77.7510,
            "source": "Public Records",
        },
        {
            "address": "Phoenix One, Whitefield",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560066",
            "property_type": PropertyType.APARTMENT,
            "area_sqft": 1180,
            "bedrooms": 2,
            "sale_price": 7500000,
            "sale_date": "2024-07-01",
            "lat": 12.9690,
            "lng": 77.7480,
            "source": "Public Records",
        },
        {
            "address": "Sobha Dream Acres, Balagere",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560087",
            "property_type": PropertyType.APARTMENT,
            "area_sqft": 1450,
            "bedrooms": 3,
            "sale_price": 8500000,
            "sale_date": "2024-06-01",
            "lat": 12.9350,
            "lng": 77.7240,
            "source": "Public Records",
        },
        {
            "address": "Purva Prestige, Varthur",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560087",
            "property_type": PropertyType.APARTMENT,
            "area_sqft": 1550,
            "bedrooms": 3,
            "sale_price": 9200000,
            "sale_date": "2024-05-15",
            "lat": 12.9355,
            "lng": 77.7250,
            "source": "Public Records",
        },
    ]

    for comp_data in test_comps:
        existing = (
            db.query(Comparable)
            .filter(Comparable.address == comp_data["address"])
            .first()
        )
        if existing:
            comps.append(existing)
            continue

        comp = Comparable(**comp_data)
        db.add(comp)
        comps.append(comp)

    db.commit()
    print(f"✅ Created {len(comps)} comparables")
    return comps


def main():
    print("🌱 Seeding PropFlow database...")

    db = SessionLocal()
    try:
        users = seed_users(db)
        properties = seed_properties(db, users)
        comps = seed_comparables(db)

        print("\n📊 Summary:")
        print(f"   Users: {len(users)}")
        print(f"   Properties: {len(properties)}")
        print(f"   Comparables: {len(comps)}")
        print("\n✨ Seeding complete!")

    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
