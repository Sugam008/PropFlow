# Testing Guide

This guide covers testing strategies, frameworks, and best practices for PropFlow.

## Testing Overview

PropFlow uses a multi-layered testing approach:

| Level         | Purpose                              | Tools                               |
| ------------- | ------------------------------------ | ----------------------------------- |
| Unit          | Test individual functions/components | Vitest (frontend), Pytest (backend) |
| Integration   | Test API endpoints and data flow     | TestClient, Testing Library         |
| E2E           | Test complete user workflows         | Playwright                          |
| Accessibility | Ensure WCAG compliance               | @axe-core/playwright                |

---

## Backend Testing (Python)

### Framework & Tools

| Tool               | Purpose                    |
| ------------------ | -------------------------- |
| pytest             | Test framework             |
| pytest-asyncio     | Async test support         |
| FastAPI TestClient | API testing                |
| SQLAlchemy         | In-memory SQLite for tests |

### Test Structure

```
backend/app/tests/
├── conftest.py           # Shared fixtures
├── test_auth.py          # Authentication tests
├── test_properties.py    # Property CRUD tests
├── test_photos.py        # Photo upload tests
├── test_valuations.py    # Valuation tests
├── test_services.py      # Service layer tests
├── test_tasks.py         # Celery task tests
├── test_websocket.py     # WebSocket tests
├── test_cache.py         # Caching tests
└── test_resilience.py    # Utility tests
```

### Test Configuration (`pyproject.toml`)

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["app/tests"]
pythonpath = ["."]
```

### Fixtures (`conftest.py`)

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.database import Base
from app.main import app
from app.api.deps import get_db

# SQLite for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

@pytest.fixture(scope="session")
def engine():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db(engine):
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db):
    from app.crud.user import create_user
    from app.schemas.user import UserCreate

    user = create_user(db, obj_in=UserCreate(
        phone="+911234567890",
        name="Test User",
        role="CUSTOMER"
    ))
    return user

@pytest.fixture
def auth_headers(test_user):
    from app.core.security import create_access_token

    token = create_access_token(test_user.id)
    return {"Authorization": f"Bearer {token}"}
```

### API Testing Patterns

```python
def test_create_property(client, auth_headers):
    response = client.post(
        "/api/v1/properties/",
        json={
            "property_type": "APARTMENT",
            "address": "123 Main St",
            "area_sqft": 1000
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["property_type"] == "APARTMENT"
    assert data["status"] == "DRAFT"

def test_property_list_role_filter(client, auth_headers, db):
    # Create properties for different users
    # ...

    response = client.get("/api/v1/properties/", headers=auth_headers)
    # Verify only user's properties returned

def test_unauthorized_access(client):
    response = client.get("/api/v1/properties/")
    assert response.status_code == 401

def test_role_based_access(client, auth_headers):
    # Test CUSTOMER cannot access admin endpoints
    response = client.delete("/api/v1/properties/xxx", headers=auth_headers)
    assert response.status_code == 403
```

### Service Testing

```python
from unittest.mock import patch, MagicMock

def test_otp_service_generate():
    from app.services.otp_service import OTPService

    with patch('redis.Redis') as mock_redis:
        mock_client = MagicMock()
        mock_redis.return_value = mock_client

        service = OTPService()
        otp = service.generate_otp("+911234567890")

        assert len(otp) == 6
        assert otp.isdigit()
        mock_client.setex.assert_called_once()

def test_image_service_exif_extraction():
    from app.services.image_service import ImageService

    service = ImageService()
    exif = service.extract_exif("test_image.jpg")

    assert "timestamp" in exif
    assert "gps" in exif
```

### Async Testing

```python
import pytest

@pytest.mark.asyncio
async def test_websocket_connection():
    from fastapi.testclient import TestClient
    from app.main import app

    with TestClient(app) as client:
        with client.websocket_connect("/ws/test_token") as websocket:
            websocket.send_json({"type": "ping"})
            response = websocket.receive_json()
            assert response["type"] == "pong"
```

### Running Tests

```bash
cd backend

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific file
pytest app/tests/test_properties.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run only marked tests
pytest -m "not slow"
```

---

## Frontend Testing (Vitest)

### Framework & Tools

| Tool                      | Purpose                |
| ------------------------- | ---------------------- |
| Vitest                    | Test framework         |
| @testing-library/react    | Component testing      |
| @testing-library/jest-dom | DOM matchers           |
| msw                       | API mocking (optional) |

### Test Structure

```
valuer-dashboard/
├── src/
│   ├── api/
│   │   └── *.test.ts        # API client tests
│   ├── components/
│   │   └── *.test.tsx       # Component tests
│   ├── store/
│   │   └── *.test.ts        # Store tests
│   └── test/
│       └── setup.ts         # Test setup
└── e2e/
    ├── workflow.spec.ts     # E2E workflow tests
    ├── accessibility.spec.ts
    └── performance.spec.ts
```

### Vitest Configuration

```typescript
// vitest.config.mts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    exclude: ['**/node_modules/**', '**/e2e/**'],
  },
});
```

### Test Setup (`src/test/setup.ts`)

```typescript
import '@testing-library/jest-dom';

// Mock matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### Component Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PropertyCard } from './PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: '123',
    address: '123 Main St',
    status: 'DRAFT',
    area_sqft: 1000,
  };

  it('renders property address', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('123 Main St')).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<PropertyCard property={mockProperty} onClick={onClick} />);

    fireEvent.click(screen.getByText('123 Main St'));
    expect(onClick).toHaveBeenCalledWith('123');
  });

  it('shows correct status badge', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('DRAFT')).toBeDefined();
  });
});
```

### Store Testing (Zustand)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useAuthStore } from './useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null });
  });

  it('sets auth correctly', () => {
    const user = { id: '1', phone: '+911234567890', role: 'CUSTOMER' };

    act(() => {
      useAuthStore.getState().setAuth(user, 'token123');
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.token).toBe('token123');
  });

  it('clears auth on logout', () => {
    act(() => {
      useAuthStore.getState().setAuth({ id: '1' }, 'token');
      useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
```

### API Client Testing

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { propertiesApi } from './properties';
import { apiClient } from './client';

vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('propertiesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('list calls correct endpoint', async () => {
    const mockData = [{ id: '1', address: 'Test' }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

    const result = await propertiesApi.list();

    expect(apiClient.get).toHaveBeenCalledWith('/properties/', { params: undefined });
    expect(result).toEqual(mockData);
  });

  it('get calls correct endpoint with id', async () => {
    const mockData = { id: '1', address: 'Test' };
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

    const result = await propertiesApi.get('1');

    expect(apiClient.get).toHaveBeenCalledWith('/properties/1');
    expect(result).toEqual(mockData);
  });
});
```

### Running Tests

```bash
# Unit tests
pnpm --filter @propflow/valuer-dashboard test

# Watch mode
pnpm --filter @propflow/valuer-dashboard test:watch

# Coverage
pnpm --filter @propflow/valuer-dashboard test:coverage
```

---

## E2E Testing (Playwright)

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'PORT=3002 pnpm dev',
    timeout: 120000,
  },
});
```

### E2E Test Patterns

```typescript
// e2e/workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Property Queue Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/v1/properties/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', address: 'Property 1', status: 'SUBMITTED' },
          { id: '2', address: 'Property 2', status: 'SUBMITTED' },
        ]),
      });
    });
  });

  test('displays property queue', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Queue');
    await expect(page.locator('[data-testid="property-card"]')).toHaveCount(2);
  });

  test('navigates to property detail', async ({ page }) => {
    await page.goto('/');

    await page.click('[data-testid="property-card"]:first-child');
    await expect(page).toHaveURL(/\/[a-f0-9-]+/);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('j'); // Navigate down
    await page.keyboard.press('Enter'); // Open

    await expect(page).toHaveURL(/\/[a-f0-9-]+/);
  });
});
```

### Accessibility Testing

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home page has no violations', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('property detail has no violations', async ({ page }) => {
    await page.goto('/123');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
```

### Performance Testing

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('home page loads within threshold', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForSelector('h1');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000);
  });
});
```

### Responsive Testing

```typescript
// e2e/responsive.spec.ts
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

for (const viewport of viewports) {
  test(`renders correctly on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
  });
}
```

### Running E2E Tests

```bash
# Run all E2E tests
pnpm --filter @propflow/valuer-dashboard test:e2e

# Run specific test file
pnpm exec playwright test e2e/workflow.spec.ts

# Run in UI mode
pnpm exec playwright test --ui

# Debug mode
pnpm exec playwright test --debug
```

---

## Test Coverage

### Coverage Targets

| Area           | Target |
| -------------- | ------ |
| Backend        | 80%    |
| Frontend       | 80%    |
| Critical paths | 100%   |

### Running Coverage

```bash
# Backend
cd backend
pytest --cov=app --cov-report=html

# Frontend
pnpm --filter @propflow/valuer-dashboard test:coverage
```

---

## Best Practices

### General

1. **Write tests first** for new features (TDD when appropriate)
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Keep tests isolated** - each test should be independent
5. **Mock external dependencies**

### Backend

1. Use fixtures for common setup
2. Test all permission levels
3. Test error cases explicitly
4. Mock external services (SMS, Vision API)

### Frontend

1. Test user interactions, not internal state
2. Use `data-testid` for stable selectors
3. Mock API responses consistently
4. Test accessibility features

### E2E

1. Mock APIs for consistent results
2. Test critical user workflows
3. Include accessibility scans
4. Set performance thresholds
