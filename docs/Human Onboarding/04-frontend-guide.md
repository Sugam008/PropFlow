# Frontend Development Guide

This guide covers frontend development for PropFlow, including the Valuer Dashboard (Next.js) and Customer App (React Native).

## Monorepo Structure

```
frontend/
├── apps/
│   ├── valuer-dashboard/      # Next.js 14 web app
│   └── customer-app/          # React Native (Expo) mobile app
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

## Customer App (React Native)

### Technology Stack

| Component     | Technology                      |
| ------------- | ------------------------------- |
| Framework     | Expo (React Native)             |
| Navigation    | React Navigation (Native Stack) |
| State         | Zustand                         |
| Data Fetching | TanStack Query                  |
| Camera        | expo-camera                     |
| Location      | expo-location                   |
| Animations    | React Native Reanimated         |

### Project Structure

```
customer-app/
├── App.tsx                   # Entry point
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx  # Navigation setup
│   ├── screens/              # Screen components
│   ├── components/           # Reusable components
│   ├── store/                # Zustand stores
│   ├── api/                  # API clients
│   ├── hooks/                # Custom hooks
│   └── utils/                # Utilities
├── app.json                  # Expo config
└── package.json
```

### Navigation Setup

```tsx
// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/useAuthStore';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="PropertyType" component={PropertyTypeScreen} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
            <Stack.Screen name="Location" component={LocationScreen} />
            <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
            <Stack.Screen name="PhotoReview" component={PhotoReviewScreen} />
            <Stack.Screen name="Submit" component={SubmitScreen} />
            <Stack.Screen name="Status" component={StatusScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Screen Pattern

```tsx
// src/screens/PropertyTypeScreen.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '@propflow/theme';

const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'VILLA', 'COMMERCIAL', 'LAND'];

export function PropertyTypeScreen() {
  const navigation = useNavigation();
  const { setPropertyType } = usePropertyStore();

  const handleSelect = (type: string) => {
    setPropertyType(type);
    navigation.navigate('PropertyDetails');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Property Type</Text>
      {PROPERTY_TYPES.map((type) => (
        <TouchableOpacity key={type} style={styles.typeButton} onPress={() => handleSelect(type)}>
          <Text style={styles.typeText}>{type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xl,
  },
  typeButton: {
    padding: spacing.lg,
    backgroundColor: colors.gray[100],
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  typeText: {
    fontSize: typography.fontSizes.lg,
    color: colors.gray[900],
  },
});
```

### Zustand Store with Persistence

```tsx
// src/store/usePropertyStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PropertyState {
  propertyType: string | null;
  address: string;
  areaSqft: number | null;
  photos: PropertyPhoto[];

  setPropertyType: (type: string) => void;
  setAddress: (address: string) => void;
  addPhoto: (photo: PropertyPhoto) => void;
  removePhoto: (id: string) => void;
  reset: () => void;
}

const STORAGE_KEY = '@propflow_property_draft';

export const usePropertyStore = create<PropertyState>((set, get) => ({
  propertyType: null,
  address: '',
  areaSqft: null,
  photos: [],

  setPropertyType: (type) => {
    set({ propertyType: type });
    saveDraft(get());
  },

  setAddress: (address) => {
    set({ address });
    saveDraft(get());
  },

  addPhoto: (photo) => {
    set((state) => ({ photos: [...state.photos, photo] }));
    saveDraft(get());
  },

  removePhoto: (id) => {
    set((state) => ({
      photos: state.photos.filter((p) => p.id !== id),
    }));
    saveDraft(get());
  },

  reset: () => {
    set({ propertyType: null, address: '', areaSqft: null, photos: [] });
    AsyncStorage.removeItem(STORAGE_KEY);
  },
}));

// Auto-save draft every 30 seconds
async function saveDraft(state: PropertyState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Load draft on app start
export async function loadDraft() {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved) {
    usePropertyStore.setState(JSON.parse(saved));
  }
}
```

### Camera Integration

```tsx
// src/screens/PhotoCaptureScreen.tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export function PhotoCaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState<CameraView>(null);

  const takePhoto = async () => {
    if (!camera) return;

    const photo = await camera.takePictureAsync({
      quality: 0.8,
      exif: true, // Capture EXIF metadata
    });

    // Photo.uri contains local file path
    // Photo.exif contains metadata (GPS, timestamp, device)
    addPhoto({
      id: generateId(),
      uri: photo.uri,
      exif: photo.exif,
    });
  };

  if (!permission?.granted) {
    return (
      <View>
        <Text>Camera permission required</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CameraView style={{ flex: 1 }} ref={setCamera}>
      <TouchableOpacity onPress={takePhoto}>
        <Text>Capture</Text>
      </TouchableOpacity>
    </CameraView>
  );
}
```

### Location Services

```tsx
// src/hooks/useLocation.ts
import * as Location from 'expo-location';
import { useState } from 'react';

export function useLocation() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setError('Location permission denied');
      return;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setLocation(position);
  };

  return { location, error, requestLocation };
}
```

---

## Environment Variables

### Valuer Dashboard (`.env`)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-token
```

### Customer App (`.env`)

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
EXPO_PUBLIC_WS_URL=ws://localhost:8000/ws
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your-token
```

**Mobile-Specific Notes:**

- Android emulator: Use `http://10.0.2.2:8000/api/v1`
- iOS simulator: Use `http://localhost:8000/api/v1`
- Physical device: Use machine's IP (e.g., `http://192.168.1.x:8000/api/v1`)

---

## Development Commands

```bash
# Valuer Dashboard
pnpm --filter @propflow/valuer-dashboard dev
pnpm --filter @propflow/valuer-dashboard build
pnpm --filter @propflow/valuer-dashboard lint
pnpm --filter @propflow/valuer-dashboard test
pnpm --filter @propflow/valuer-dashboard test:e2e

# Customer App
pnpm --filter @propflow/customer-app dev
pnpm --filter @propflow/customer-app start   # Expo start
pnpm --filter @propflow/customer-app android # Run on Android
pnpm --filter @propflow/customer-app ios     # Run on iOS
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
