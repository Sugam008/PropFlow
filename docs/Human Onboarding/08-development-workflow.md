# Development Workflow

This guide covers the development workflow, coding standards, and best practices for PropFlow.

## Getting Started Checklist

Before starting development:

- [ ] Development environment set up (see [01-getting-started.md](./01-getting-started.md))
- [ ] Docker services running
- [ ] IDE configured with extensions
- [ ] Git configured
- [ ] Access to repository

---

## Git Workflow

### Branch Strategy

```
main ─────────────────────────────────────────────►
  │
  ├── feature/CUST-101-property-submission ─────►
  │                                          │
  │                                          └── PR ──► main
  │
  ├── feature/VAL-201-review-queue ─────────────►
  │                                           │
  │                                           └── PR ──► main
  │
  └── bugfix/CUST-102-fix-otp-validation ──────►
                                              │
                                              └── PR ──► main
```

### Branch Naming Convention

| Type    | Pattern                      | Example                                |
| ------- | ---------------------------- | -------------------------------------- |
| Feature | `feature/TICKET-description` | `feature/CUST-101-property-submission` |
| Bugfix  | `bugfix/TICKET-description`  | `bugfix/VAL-102-fix-otp-validation`    |
| Hotfix  | `hotfix/TICKET-description`  | `hotfix/OPS-201-fix-deployment`        |
| Chore   | `chore/description`          | `chore/update-dependencies`            |

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples**:

```
feat(backend): add property valuation endpoint

fix(mobile): resolve GPS permission issue on Android

docs(onboarding): add troubleshooting section
```

---

## Development Process

### 1. Start New Work

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/CUST-101-property-submission
```

### 2. Development Cycle

```bash
# Make changes
# ...

# Run checks frequently
pnpm lint
pnpm type-check
pnpm test

# Commit changes
git add .
git commit -m "feat(backend): add property submission endpoint"
```

### 3. Before Push

```bash
# Run full check suite
pnpm lint && pnpm type-check && pnpm test

# Backend specific
cd backend && ruff check . && mypy . && pytest

# Frontend specific
pnpm --filter @propflow/valuer-dashboard test
```

### 4. Push & Create PR

```bash
# Push branch
git push origin feature/CUST-101-property-submission

# Create PR via GitHub CLI
gh pr create --title "feat: Add property submission" --body "Description..."
```

### 5. PR Review

- Request review from team members
- Address review comments
- Ensure CI passes
- Squash and merge when approved

---

## Code Style

### TypeScript/React

**Formatting**:

- Use Prettier (auto-format on save)
- 2-space indentation
- Single quotes for strings
- Trailing commas in arrays/objects

**Patterns**:

```typescript
// Functional components with explicit types
interface Props {
  property: Property;
  onSelect: (id: string) => void;
}

export function PropertyCard({ property, onSelect }: Props) {
  // Hooks at the top
  const [isOpen, setIsOpen] = useState(false);

  // Early returns
  if (!property) return null;

  // Handlers
  const handleClick = () => onSelect(property.id);

  // JSX
  return (
    <div onClick={handleClick}>
      {/* ... */}
    </div>
  );
}
```

**Imports Order**:

```typescript
// 1. External imports
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal imports (alias)
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/useAuthStore';

// 3. Types
import type { Property } from '@propflow/types';

// 4. Styles
import { colors, spacing } from '@propflow/theme';
```

### Python

**Formatting**:

- Use Ruff (auto-format on save)
- 4-space indentation
- Line length: 88 characters
- Double quotes for strings

**Patterns**:

```python
# Type hints on all functions
def create_property(
    db: Session,
    *,
    obj_in: PropertyCreate,
    user_id: UUID,
) -> Property:
    """Create a new property record.

    Args:
        db: Database session
        obj_in: Property creation schema
        user_id: Owner's user ID

    Returns:
        Created property instance
    """
    db_obj = Property(
        **obj_in.model_dump(),
        user_id=user_id,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
```

**Import Order**:

```python
# 1. Standard library
from typing import Optional, List

# 2. Third-party
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# 3. Local imports
from app.api.deps import get_db, get_current_user
from app.schemas.property import PropertyCreate, PropertyInDB
```

---

## Testing Standards

### Test Coverage Requirements

| Area                | Minimum Coverage |
| ------------------- | ---------------- |
| Backend API         | 80%              |
| Frontend Components | 80%              |
| Critical Paths      | 100%             |

### Test Naming Convention

```python
# Python
def test_<action>_<expected_result>():
    pass

# Examples
def test_create_property_returns_property():
def test_submit_property_requires_photos():
def test_valuer_can_approve_property():
```

```typescript
// TypeScript
describe('ComponentName', () => {
  it('should do something when condition', () => {
    // ...
  });
});

// Examples
describe('PropertyCard', () => {
  it('should display property address', () => {});
  it('should call onClick when clicked', () => {});
});
```

### Test Structure (AAA Pattern)

```python
def test_create_property():
    # Arrange
    user = create_test_user(db)
    property_data = PropertyCreate(address="123 Main St")

    # Act
    property = crud.property.create(db, obj_in=property_data, user_id=user.id)

    # Assert
    assert property.address == "123 Main St"
    assert property.status == PropertyStatus.DRAFT
```

---

## Code Review Guidelines

### As Author

- [ ] Self-review before requesting review
- [ ] Write clear PR description
- [ ] Link related tickets
- [ ] Add tests for new functionality
- [ ] Update documentation if needed
- [ ] Keep PRs small (< 400 lines)

### As Reviewer

- [ ] Review within 24 hours
- [ ] Be constructive and specific
- [ ] Focus on logic, not style (use linter)
- [ ] Suggest improvements, don't just critique
- [ ] Approve when ready, don't block unnecessarily

### PR Checklist

```markdown
## PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Self-reviewed code
- [ ] Ready for review
```

---

## Adding New Features

### Backend Feature

1. **Define Schema** (`app/schemas/`)

```python
class NewFeatureBase(BaseModel):
    name: str
    value: int

class NewFeatureCreate(NewFeatureBase):
    pass

class NewFeatureInDB(NewFeatureBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
```

2. **Create Model** (`app/models/`)

```python
class NewFeature(Base):
    __tablename__ = "new_feature"

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)
    value = Column(Integer, nullable=False)
```

3. **Add CRUD** (`app/crud/`)

```python
class CRUDNewFeature(CRUDBase[NewFeature, NewFeatureCreate, None]):
    pass

new_feature = CRUDNewFeature(NewFeature)
```

4. **Create Endpoint** (`app/api/v1/endpoints/`)

```python
@router.post("/", response_model=NewFeatureInDB)
def create_feature(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    feature_in: NewFeatureCreate,
):
    return crud.new_feature.create(db, obj_in=feature_in)
```

5. **Add Migration**

```bash
alembic revision --autogenerate -m "Add new_feature table"
alembic upgrade head
```

6. **Add Tests** (`app/tests/`)

```python
def test_create_feature(client, auth_headers):
    response = client.post("/api/v1/new-feature/", json={...}, headers=auth_headers)
    assert response.status_code == 200
```

### Frontend Feature

1. **Define Types** (`@propflow/types`)

```typescript
export interface NewFeature {
  id: string;
  name: string;
  value: number;
}
```

2. **Add API Client** (`src/api/`)

```typescript
export const newFeatureApi = {
  create: async (data: NewFeatureCreate) => {
    const { data: response } = await apiClient.post('/new-feature/', data);
    return response;
  },
};
```

3. **Create Component** (`src/components/`)

```tsx
export function NewFeatureForm() {
  const mutation = useMutation({
    mutationFn: newFeatureApi.create,
    onSuccess: () => toast.success('Created!'),
  });

  return <form>...</form>;
}
```

4. **Add to Page/Route**

```tsx
// In page component
<NewFeatureForm />
```

5. **Add Tests** (`src/components/__tests__/`)

```typescript
describe('NewFeatureForm', () => {
  it('should submit form', () => {
    // ...
  });
});
```

---

## Debugging

### Backend Debugging

```python
# Add logging
import logging
logger = logging.getLogger(__name__)

def some_function():
    logger.debug(f"Processing: {data}")
    logger.info(f"Created: {result}")
    logger.error(f"Failed: {error}")
```

```bash
# View logs
docker-compose logs -f api

# Or run with debug
uvicorn app.main:app --reload --log-level debug
```

### Frontend Debugging

```typescript
// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools />
</QueryClientProvider>

// Console logging
console.log('State:', state);
console.error('Error:', error);
```

### Database Debugging

```sql
-- Check current connections
SELECT * FROM pg_stat_activity;

-- Find slow queries
SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Check table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) FROM pg_catalog.pg_statio_user_tables;
```

---

## Performance Optimization

### Backend

- **Use async** for I/O operations
- **Cache expensive queries** with Redis
- **Use background tasks** for heavy operations
- **Optimize queries** with proper indexes

### Frontend

- **Memoize components** with `React.memo`
- **Use TanStack Query** for caching
- **Lazy load** routes and components
- **Optimize images** with Next.js Image

---

## Security Checklist

- [ ] Never commit secrets or credentials
- [ ] Validate all user input
- [ ] Use parameterized queries (SQLAlchemy does this)
- [ ] Implement rate limiting on sensitive endpoints
- [ ] Use HTTPS in production
- [ ] Sanitize user-generated content
- [ ] Review dependencies for vulnerabilities

---

## Documentation Standards

### Code Comments

```python
# Good: Explain why, not what
# Calculate distance using Haversine formula for accuracy on Earth's surface
def calculate_distance(lat1, lon1, lat2, lon2):
    pass

# Bad: Explain what (obvious from code)
# Add 1 to x
x = x + 1
```

### Docstrings

```python
def process_photo(photo_id: str) -> PhotoResult:
    """Process an uploaded photo for QC validation.

    Extracts EXIF metadata, validates GPS coordinates against
    property location, and checks photo quality metrics.

    Args:
        photo_id: UUID of the photo to process

    Returns:
        PhotoResult with QC status and any issues found

    Raises:
        NotFoundError: If photo doesn't exist
        ValidationError: If photo file is invalid
    """
    pass
```

### README Updates

When adding new features:

1. Update relevant README sections
2. Add usage examples
3. Document new environment variables
4. Update API documentation

---

## Common Commands Reference

```bash
# Development
pnpm dev                    # Start all dev servers
pnpm lint                   # Lint all code
pnpm type-check            # Type check all code
pnpm test                  # Run all tests

# Backend
cd backend
uvicorn app.main:app --reload
pytest --cov=app
alembic upgrade head

# Frontend
pnpm --filter @propflow/valuer-dashboard dev
pnpm --filter @propflow/valuer-dashboard test
pnpm --filter @propflow/valuer-dashboard test:e2e

# Docker
docker-compose up -d
docker-compose down
docker-compose logs -f api

# Git
git checkout main
git pull origin main
git checkout -b feature/TICKET-description
git add . && git commit -m "type: message"
git push origin HEAD
gh pr create
```
