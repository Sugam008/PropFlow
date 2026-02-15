# Domain Model: PropFlow

## Entities

### User
- `id`: UUID (PK)
- `phone_number`: String (Unique, Indexed)
- `role`: Enum (CUSTOMER, VALUER, ADMIN)
- `full_name`: String
- `created_at`: DateTime
- `is_active`: Boolean

### Property
- `id`: UUID (PK)
- `customer_id`: UUID (FK -> User.id)
- `property_type`: Enum (FLAT, HOUSE, PLOT)
- `address`: Text
- `pincode`: String
- `coordinates`: Geometry(Point) / Lat, Lng
- `area_sqft`: Float
- `status`: Enum (DRAFT, SUBMITTED, UNDER_REVIEW, FOLLOW_UP_REQUIRED, APPROVED, REJECTED)
- `created_at`: DateTime
- `updated_at`: DateTime

### PropertyPhoto
- `id`: UUID (PK)
- `property_id`: UUID (FK -> Property.id)
- `photo_url`: String (S3 path)
- `photo_type`: Enum (FRONT, SIDE, INTERNAL, DOCUMENT)
- `gps_lat`: Float
- `gps_lng`: Float
- `exif_metadata`: JSONB (Device, Timestamp, etc.)
- `verification_status`: Enum (PENDING, PASS, FAIL)
- `created_at`: DateTime

### Valuation
- `id`: UUID (PK)
- `property_id`: UUID (FK -> Property.id)
- `valuer_id`: UUID (FK -> User.id)
- `amount`: Decimal
- `valuer_comments`: Text
- `report_url`: String (S3 path)
- `created_at`: DateTime

### Comparable
- `id`: UUID (PK)
- `property_id`: UUID (FK -> Property.id)
- `source`: Enum (AUTOMATED, MANUAL)
- `address`: Text
- `area_sqft`: Float
- `price`: Decimal
- `distance_km`: Float
- `created_at`: DateTime

### AuditLog
- `id`: UUID (PK)
- `entity_type`: String (e.g., "Property")
- `entity_id`: UUID
- `user_id`: UUID (FK -> User.id)
- `action`: String (e.g., "STATUS_CHANGE")
- `changes`: JSONB (Old value -> New value)
- `created_at`: DateTime

## Relationships
- **User -> Property**: One-to-Many
- **Property -> PropertyPhoto**: One-to-Many
- **Property -> Valuation**: One-to-One
- **Property -> Comparable**: One-to-Many
- **User -> AuditLog**: One-to-Many
