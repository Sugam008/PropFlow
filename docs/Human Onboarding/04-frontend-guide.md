# Frontend Development Guide

This guide covers frontend development for PropFlow, including the Valuer Dashboard (Next.js) and Customer Portal (Next.js PWA).

## Monorepo Structure

```
frontend/
├── apps/
│   ├── valuer-dashboard/      # Next.js 14 web app (Valuer/Admin)
│   └── customer-portal/       # Next.js 14 PWA (Customer)
└── packages/
    ├── theme/                 # Design tokens (colors, spacing, typography)
    ├── types/                 # Shared TypeScript types
    ├── ui/                    # Shared UI components
    └── utils/                 # Shared utilities
```

---

## Shared Packages

### Theme (`@propflow/theme`)

Design tokens for consistent styling across all apps:

```typescript
import { colors, spacing, typography } from '@propflow/theme';

// Usage in styles
const styles = {
  container: {
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.brand,
  },
};
```

**Available Tokens:**

| Token          | Description                                 |
| -------------- | ------------------------------------------- |
| `colors`       | Brand, status, grayscale, semantic colors   |
| `spacing`      | 4px-based scale (xs to 3xl)                 |
| `typography`   | Font families, sizes, weights, line heights |
| `borderRadius` | Rounded corner values                       |
| `animations`   | Durations, easings, transitions             |
| `shadows`      | Box shadow values                           |

**Brand Colors:**

```typescript
colors.brand; // #E31E24 (ABC Red)
colors.brandLight; // #FF4D52
colors.brandDark; // #B3181C
```

### Types (`@propflow/types`)

Shared TypeScript interfaces:

```typescript
import { User, Property, PropertyPhoto, Valuation } from '@propflow/types';

interface User {
  id: string;
  phone: string;
  role: 'CUSTOMER' | 'VALUER' | 'ADMIN';
  name: string | null;
}
```

### UI Components (`@propflow/ui`)

Shared components used across applications:

| Component  | Props                            | Description                        |
| ---------- | -------------------------------- | ---------------------------------- |
| `Button`   | variant, size, disabled, loading | Primary, secondary, outline, ghost |
| `Input`    | type, placeholder, error, value  | Form input                         |
| `Card`     | title, children                  | Container component                |
| `Badge`    | variant, children                | Status indicators                  |
| `Modal`    | isOpen, onClose, children        | Dialog component                   |
| `Toast`    | message, type                    | Notifications                      |
| `OTPInput` | length, onComplete               | OTP entry                          |
| `Skeleton` | width, height                    | Loading placeholder                |

---

## Valuer Dashboard (Next.js 14)

### Technology Stack

| Component     | Technology                                |
| ------------- | ----------------------------------------- |
| Framework     | Next.js 14 (App Router)                   |
| React         | React 18                                  |
| Styling       | Custom design tokens (inline styles)      |
| State         | Zustand (client), TanStack Query (server) |
| Data Fetching | TanStack Query + Axios                    |
| Maps          | Leaflet, react-leaflet                    |
| Animations    | Framer Motion                             |
| Testing       | Vitest, Playwright                        |

### Project Structure

```
valuer-dashboard/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home (property queue)
│   ├── [id]/
│   │   └── page.tsx         # Property detail
│   ├── analytics/
│   │   └── page.tsx         # Analytics dashboard
│   └── api/
│       └── health/
│           └── route.ts     # Health check
├── src/
│   ├── components/          # App-specific components
│   ├── api/                 # API clients
│   ├── store/               # Zustand stores
│   └── hooks/               # Custom hooks
├── public/                  # Static assets
├── e2e/                     # Playwright tests
└── package.json
```

### App Router Conventions

**Layout (`app/layout.tsx`):**

```tsx
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { WebSocketProvider } from '@/providers/WebSocketProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ToastProvider>
            <WebSocketProvider>{children}</WebSocketProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

**Page (`app/page.tsx`):**

```tsx
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '@/api/properties';

export default function HomePage() {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.list,
  });

  if (isLoading) return <Skeleton count={5} />;

  return (
    <div>
      {properties?.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

**Dynamic Route (`app/[id]/page.tsx`):**

```tsx
export default function PropertyPage({ params }) {
  const { id } = params;

  const { data: property } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesApi.get(id),
  });

  return <PropertyDetail property={property} />;
}
```

### State Management

**Zustand Store (`src/store/useAuthStore.ts`):**

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' },
  ),
);
```

**TanStack Query Setup (`src/providers/QueryProvider.tsx`):**

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

### API Client

**Base Client (`src/api/client.ts`):**

```tsx
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**API Module (`src/api/properties.ts`):**

```tsx
import { apiClient } from './client';

export const propertiesApi = {
  list: async (params?: { status?: string }) => {
    const { data } = await apiClient.get('/properties/', { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get(`/properties/${id}`);
    return data;
  },

  create: async (property: PropertyCreate) => {
    const { data } = await apiClient.post('/properties/', property);
    return data;
  },
};
```

### Styling Pattern

PropFlow uses inline styles with design tokens (no Tailwind, styled-components, or CSS modules):

```tsx
import { colors, spacing, typography, borderRadius } from '@propflow/theme';

const styles = {
  container: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  badge: {
    backgroundColor: colors.status.pending,
    color: colors.white,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.full,
  },
};

export function PropertyCard({ property }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{property.address}</h2>
      <span style={styles.badge}>{property.status}</span>
    </div>
  );
}
```

### Animations (Framer Motion)

```tsx
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function PropertyList({ properties }) {
  return (
    <AnimatePresence>
      {properties.map((property) => (
        <motion.div
          key={property.id}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.2 }}
        >
          <PropertyCard property={property} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

### Keyboard Navigation

The Valuer Dashboard supports keyboard shortcuts:

```tsx
// src/hooks/useKeyboardNavigation.ts
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'j':
          // Navigate down
          break;
        case 'k':
          // Navigate up
          break;
        case 'Enter':
          // Open selected
          break;
        case '?':
          // Show shortcuts modal
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
```

---

## Customer Portal (Next.js PWA)

The Customer Portal is a Progressive Web App (PWA) built with Next.js 14, sharing the same technology stack and architectural patterns as the Valuer Dashboard.

### Key Differences from Dashboard

- **Mobile-First Design**: UI is optimized for touch targets and small screens.
- **PWA Capabilities**: Service workers for offline capabilities and installation.
- **Simplified Flow**: Linear wizard-based interface for property submission.

### Project Structure

```
customer-portal/
├── app/                      # Next.js App Router
│   ├── login/               # Authentication
│   ├── new/                 # Submission Wizard
│   │   ├── details/
│   │   ├── location/
│   │   ├── photos/
│   │   └── review/
│   └── property/            # Property status & results
└── src/
    ├── components/          # App-specific components
    ├── api/                 # API clients
    ├── store/               # Zustand stores
    └── hooks/               # Custom hooks
```

### Camera Integration

The portal uses HTML5 Media Capture API and file inputs for photo uploads, enforcing camera capture on mobile devices where supported.

### Location Services

Uses browser Geolocation API and interactive maps (Leaflet) for property location confirmation.

---

## Environment Variables

### Valuer Dashboard (`.env`)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-token
```

### Customer Portal (`.env`)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-token
```

---

## Development Commands

```bash
# Valuer Dashboard
pnpm --filter @propflow/valuer-dashboard dev
pnpm --filter @propflow/valuer-dashboard build
pnpm --filter @propflow/valuer-dashboard lint
pnpm --filter @propflow/valuer-dashboard test
pnpm --filter @propflow/valuer-dashboard test:e2e

# Customer Portal
pnpm --filter @propflow/customer-portal dev
pnpm --filter @propflow/customer-portal build
pnpm --filter @propflow/customer-portal lint
pnpm --filter @propflow/customer-portal type-check
```

---

## Best Practices

1. **Use shared packages** for types, components, and utilities
2. **Use design tokens** for consistent styling
3. **Keep components small** and focused
4. **Use TypeScript** for type safety
5. **Handle loading and error states** explicitly
6. **Implement accessibility** (ARIA labels, touch targets)
7. **Test critical paths** with unit and E2E tests
8. **Follow React best practices** (hooks, memoization)
