# Customer App to Website Conversion Plan

## Overview

Convert the existing **React Native/Expo customer app** (`frontend/apps/customer-app`) into a **Next.js web application** (`frontend/apps/customer-portal`) that follows the same frontend style, design system, and architecture as the **valuer dashboard** (`frontend/apps/valuer-dashboard`).

Additionally, **fully decommission** the existing React Native customer-app (including iOS/Android build configs, CI/CD pipelines, and all mobile-specific references).

---

## Scope

### In Scope

- Build a new customer web app (`customer-portal`) in the frontend apps workspace
- Reuse visual language and architecture from valuer dashboard
- Migrate all customer flow screens to web routes/components
- Remove mobile app code and mobile CI/CD/build references
- Update monorepo docs and setup guides

### Out of Scope

- Backend API redesign
- New product features outside the existing customer journey
- Native app maintenance (iOS/Android intentionally removed)

---

## Current State Analysis

### Customer App (Legacy - Removed)

- **Framework**: Expo SDK 50 with React Native - Decommissioned
- **Navigation**: React Navigation (Native Stack)
- **Storage**: AsyncStorage for draft persistence
- **Features**: Camera, GPS Location, Haptic feedback
- **Screens**: 11 total screens across auth and main flows
- **Location**: `frontend/apps/customer-app/`

**Evidence from repo:**

- `frontend/apps/customer-app/package.json` — (Removed)
- `frontend/apps/customer-app/app.json` — (Removed)
- `frontend/apps/customer-app/eas.json` — (Removed)

### Valuer Dashboard (Next.js)

- **Framework**: Next.js 16 with App Router
- **Styling**: Inline CSS with theme tokens, Framer Motion animations
- **Layout**: Sidebar navigation with glass morphism effect
- **Maps**: Leaflet/React-Leaflet
- **State**: Zustand stores
- **Location**: `frontend/apps/valuer-dashboard/`

**Style baseline files:**

- `frontend/apps/valuer-dashboard/app/layout.tsx`
- `frontend/apps/valuer-dashboard/src/components/ClientLayout.tsx`
- `frontend/apps/valuer-dashboard/src/components/Sidebar.tsx`
- `frontend/apps/valuer-dashboard/src/components/TopBar.tsx`
- `frontend/apps/valuer-dashboard/app/globals.css`

### Shared Packages

- `@propflow/theme` — Design tokens (colors, spacing, typography, glass, shadows)
- `@propflow/types` — Shared TypeScript enums & interfaces
- `@propflow/ui` — Shared UI components
- `@propflow/utils` — Shared utilities

---

## Architecture Decision Matrix

| Decision Area | Choice                                         | Rationale                                         |
| ------------- | ---------------------------------------------- | ------------------------------------------------- |
| Framework     | **Next.js 16 (App Router)**                    | Matches valuer dashboard architecture exactly     |
| Styling       | **Inline styles + `@propflow/theme` tokens**   | Maximum visual parity with valuer dashboard       |
| Animations    | **`framer-motion`**                            | Already used in valuer dashboard                  |
| Icons         | **`lucide-react`**                             | Shared icon language with valuer dashboard        |
| Maps          | **`react-leaflet`**                            | Already present in dashboard stack                |
| Location      | **Browser Geolocation API**                    | Web-native replacement for mobile location        |
| Photos        | **File input + drag/drop (+ optional camera)** | Web-native replacement for mobile camera          |
| State         | **Zustand + localStorage persistence**         | Aligns with dashboard and web expectations        |
| Data fetching | **React Query + Axios**                        | Existing project pattern                          |
| Port          | **3001**                                       | Avoid collision with valuer dashboard on 3000     |
| Auth          | **Phone + Password** (same as valuer)          | Simpler for web, matches valuer dashboard pattern |

---

## Pre-Implementation Decision Gates

Close these decisions before writing production code:

1. **Auth mode**: OTP-first vs phone+password-first (with OTP fallback)
2. **Photo acquisition strategy**: upload-only vs upload + web camera capture
3. **Map behavior**: Leaflet only vs adding third-party geocoding/autocomplete provider
4. **PWA scope**: installable app behavior needed at launch or deferred
5. **Analytics**: launch with tracking baseline or add post-MVP
6. **Cutover strategy**: big-bang switch vs staged rollout with feature flag

---

## Navigation IA Contract

Primary sidebar navigation should be fixed early and reused across layout/tests/docs:

| Label                         | Route            | Notes                                   |
| ----------------------------- | ---------------- | --------------------------------------- |
| New Valuation                 | `/new`           | Starts wizard flow                      |
| My Properties                 | `/`              | Default landing for authenticated users |
| Track Status                  | `/property/[id]` | Usually reached from property list card |
| Help & Support (optional MVP) | `/help`          | Include only if MVP scope approves      |

Topbar should map titles by route group to avoid inconsistent page headers.

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Create New Next.js App

Create `frontend/apps/customer-portal/` as a new Next.js app:

```
frontend/apps/customer-portal/
├── app/
│   ├── layout.tsx                  # Root layout (Inter font, providers, metadata)
│   ├── globals.css                 # Global styles + animations
│   ├── page.tsx                    # My Properties listing (home)
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── new/
│   │   ├── page.tsx                # Step 1: Property Type selection
│   │   ├── details/
│   │   │   └── page.tsx            # Step 2: Property Details form
│   │   ├── location/
│   │   │   └── page.tsx            # Step 3: Location + Map
│   │   ├── photos/
│   │   │   └── page.tsx            # Step 4: Photo Upload
│   │   └── review/
│   │       └── page.tsx            # Step 5: Review & Submit
│   ├── property/
│   │   └── [id]/
│   │       ├── page.tsx            # Property Status page
│   │       ├── result/
│   │       │   └── page.tsx        # Valuation Result
│   │       └── follow-up/
│   │           └── page.tsx        # Follow-up actions
│   └── api/
│       └── proxy/
│           └── [...path]/
│               └── route.ts         # API proxy if needed
├── src/
│   ├── api/
│   │   ├── client.ts               # Axios client (web-native)
│   │   ├── auth.ts                 # Auth API calls
│   │   └── property.ts             # Property API calls
│   ├── components/
│   │   ├── ClientLayout.tsx        # Sidebar + TopBar + content wrapper
│   │   ├── Sidebar.tsx             # Customer navigation sidebar
│   │   ├── TopBar.tsx              # Header with search + user
│   │   ├── Stepper.tsx             # Multi-step progress indicator
│   │   ├── FileUpload.tsx          # Drag-and-drop photo upload
│   │   ├── PhotoGrid.tsx           # Photo preview grid
│   │   ├── PropertyCard.tsx        # Property listing card
│   │   ├── StatusTimeline.tsx      # Status progress timeline
│   │   ├── ConfidenceMeter.tsx     # Circular confidence score
│   │   ├── Badge.tsx               # Status badges
│   │   ├── Card.tsx                # Reusable card component
│   │   ├── Modal.tsx               # Dialog component
│   │   ├── MapView.tsx             # Leaflet map
│   │   ├── ErrorBoundary.tsx       # Error boundary
│   │   └── PageTransition.tsx      # Route transition animation
│   ├── hooks/
│   │   ├── useMediaQuery.ts        # Responsive breakpoint hook
│   │   └── useGeolocation.ts       # Browser geolocation hook
│   ├── providers/
│   │   ├── QueryProvider.tsx        # React Query setup
│   │   ├── ToastProvider.tsx       # Toast notification provider
│   │   └── WebSocketProvider.tsx   # Real-time WebSocket provider
│   └── store/
│       ├── useAuthStore.ts         # Auth state (Zustand + localStorage)
│       └── usePropertyStore.ts     # Property draft state (Zustand + localStorage)
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── icons/
├── .env.example
├── Dockerfile
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

### 1.2 Package Configuration

Copy configuration patterns from valuer dashboard:

- `next.config.js` (with PWA support)
- `tsconfig.json`
- `eslint.config.mjs`
- `.env.example`

Dependencies (same as valuer dashboard + customer needs):

- `next`, `react`, `react-dom`
- `framer-motion`, `lucide-react`
- `zustand`, `axios`
- `@tanstack/react-query`
- `leaflet`, `react-leaflet`, `@types/leaflet`
- `@propflow/theme`, `@propflow/types`, `@propflow/ui`, `@propflow/utils`
- `@ducanh2912/next-pwa`

### 1.3 Remove Native Dependencies

| Remove                  | Replace With                                      |
| ----------------------- | ------------------------------------------------- |
| expo-camera             | `<input type="file" capture="environment">`       |
| expo-location           | Browser Geolocation API (`navigator.geolocation`) |
| expo-haptics            | CSS animations only                               |
| AsyncStorage            | localStorage                                      |
| react-native-maps       | react-leaflet                                     |
| @react-navigation/\*    | Next.js App Router                                |
| SafeAreaView            | CSS padding                                       |
| expo-secure-store       | localStorage                                      |
| react-native-reanimated | framer-motion                                     |

---

## Phase 2: Core Layout & Navigation

### 2.1 Root Layout (app/layout.tsx)

Mirror the valuer dashboard's root layout:

- Import Inter font from `next/font/google`
- Set metadata for SEO (title: "PropFlow Customer Portal | Aditya Birla Capital")
- Global styles in `app/globals.css` (copy from valuer dashboard, add customer-specific animations)
- Wrap with `QueryProvider`, `ToastProvider`, `WebSocketProvider`, `ErrorBoundary`
- Use `ClientLayout` with customer-specific sidebar navigation

### 2.2 Client Layout Component

- Glass morphism sidebar (dark theme)
- Main content area with rounded corners
- Page transition animations
- Responsive design (mobile-first)
- Skeleton loading state matching valuer dashboard's pattern

### 2.3 Sidebar Component

Adapt valuer-dashboard Sidebar with customer-specific menu:

```
- 🏠 New Valuation → `/new` (the multi-step flow)
- 📋 My Properties → `/` (list of submitted properties)
- 📊 Track Status → `/track`
```

### 2.4 TopBar Component

- Same glass.light header with search bar
- Page title changes based on route
- User avatar + notification bell
- Mobile hamburger menu

### 2.5 Public vs Protected Routes

- Public: `/login` (phone + OTP)
- Protected: All valuation routes (require authentication)
- Auth guard with skeleton during hydration to prevent flash

---

## Phase 3: Screen Conversions

### 3.1 React Native → Next.js File Mapping

| React Native Source                          | Website Target                               |
| -------------------------------------------- | -------------------------------------------- |
| `App.tsx`                                    | `app/layout.tsx`                             |
| `src/navigation/AppNavigator.tsx`            | App Router route structure                   |
| `src/screens/auth/WelcomeScreen.tsx`         | `app/login/page.tsx` (step 1)                |
| `src/screens/auth/OTPScreen.tsx`             | `app/login/page.tsx` (step 2)                |
| `src/screens/main/PropertyTypeScreen.tsx`    | `app/new/page.tsx`                           |
| `src/screens/main/PropertyDetailsScreen.tsx` | `app/new/details/page.tsx`                   |
| `src/screens/main/LocationScreen.tsx`        | `app/new/location/page.tsx`                  |
| `src/screens/main/PhotoCaptureScreen.tsx`    | `app/new/photos/page.tsx`                    |
| `src/screens/main/PhotoReviewScreen.tsx`     | `app/new/photos/page.tsx`                    |
| `src/screens/main/SubmitScreen.tsx`          | `app/new/review/page.tsx`                    |
| `src/screens/main/StatusScreen.tsx`          | `app/property/[id]/page.tsx`                 |
| `src/screens/main/ValuationResultScreen.tsx` | `app/property/[id]/result/page.tsx`          |
| `src/screens/main/FollowUpScreen.tsx`        | `app/property/[id]/follow-up/page.tsx`       |
| `src/store/useAuthStore.ts`                  | `src/store/useAuthStore.ts` (copy)           |
| `src/store/usePropertyStore.ts`              | `src/store/usePropertyStore.ts` (adapt)      |
| `src/api/property.ts`                        | `src/api/property.ts` (copy)                 |
| `src/providers/WebSocketProvider.tsx`        | `src/providers/WebSocketProvider.tsx` (copy) |

### 3.2 Welcome → Home Page (app/page.tsx)

**Current**: Animated logo, tagline, phone input, get started button
**Web Version**:

- Hero section with gradient background
- Animated PropFlow logo using Framer Motion
- Property type quick-select cards
- "Track Existing Valuation" secondary action
- Feature badges (Fast, Secure, Free)

### 3.2 Auth Flow (app/login/page.tsx)

**Current**: Phone input → OTP screen navigation
**Web Version**:

- Single page with step indicator
- Phone input with country code
- OTP input using @propflow/ui OTPInput component
- Animated transitions between steps

### 3.3 Property Type Selection (app/new/page.tsx)

**Current**: Grid of property type cards with icons
**Web Version**:

- Card grid with hover animations
- Selection highlight with primary color
- Auto-navigate on selection or "Next" button
- Mobile: 2 columns, Desktop: 3-4 columns
- Use `framer-motion` for hover/tap animations (instead of RN Haptics)

### 3.4 Property Details (app/new/details/page.tsx)

**Current**: Form with property attributes
**Web Version**:

- Multi-step form wizard
- Progress indicator
- Validation with error messages
- "Save & Continue Later" option
- Two-column layout for desktop

### 3.5 Location Screen (app/new/location/page.tsx)

**Current**: react-native-maps with GPS capture
**Web Version**:

- Leaflet map integration
- Browser Geolocation API for "Get Current Location"
- Address autocomplete (optional enhancement)
- Draggable marker
- Form fields for address, city, pincode, state

### 3.6 Photo Upload (app/new/photos/page.tsx)

**Current**: expo-camera with capture button
**Web Version**:

- File upload with drag-and-drop
- Camera capture option via WebRTC (getUserMedia)
- Preview gallery
- Photo guidelines and tips
- Max file size validation
- Multiple photo types: Exterior, Interior, Documents

### 3.7 Photo Review (app/new/photos/page.tsx combined)

**Current**: Photo grid with reorder/remove
**Web Version**:

- Sortable photo grid
- Remove button on hover
- Photo labels/tags
- Full-screen preview modal

### 3.8 Submit Screen (app/new/review/page.tsx)

**Current**: Summary view with submit button
**Web Version**:

- Complete property summary card
- Edit buttons for each section
- Terms & conditions checkbox
- Submit button with loading state
- Success animation on submission

### 3.9 Status Screen (app/property/[id]/page.tsx)

**Current**: Status indicator with timeline
**Web Version**:

- Real-time status via WebSocket
- Animated timeline/stepper
- Estimated completion time
- Notification preferences
- Share valuation link

### 3.10 Valuation Result (app/property/[id]/result/page.tsx)

**Current**: Estimated value, confidence, comparables
**Web Version**:

- Celebratory animation on load
- Large value display with confidence score
- Comparable properties cards
- Valuation methodology section
- Download PDF report button
- Apply for loan CTA

### 3.11 Follow-up Screen (app/property/[id]/follow-up/page.tsx)

**Current**: Valuer notes and action items
**Web Version**:

- Follow-up questions form
- File upload for additional documents
- Chat/messaging interface (optional)
- Response timeline

---

## Phase 4: State Management

### 4.1 Auth Store (useAuthStore.ts)

Adapt from valuer dashboard's auth store:

- Same Zustand + persist + localStorage pattern
- Storage key: `propflow-customer-auth` (different from valuer's key)
- Login via `POST /api/v1/auth/login/access-token` (same endpoint)
- Fetch user via `GET /api/v1/users/me`
- `login`, `setAuth`, `setToken`, `logout` methods

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  requestOtp: (phone: string) => Promise<boolean>;
}
```

### 4.2 Property Store (usePropertyStore.ts)

```typescript
interface PropertyState {
  draft: PropertyDraft;
  photos: PhotoItem[];
  currentStep: number;
  isLoading: boolean;
  lastSaved: Date | null;

  // Actions
  setDraft: (data: Partial<PropertyDraft>) => void;
  addPhoto: (photo: PhotoItem) => void;
  removePhoto: (id: string) => void;
  setCurrentStep: (step: number) => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<boolean>;
  resetDraft: () => void;
}
```

### 4.3 Persistence

- Replace AsyncStorage with localStorage
- Auto-save drafts every 30 seconds
- Recover drafts on page refresh
- Clear drafts on successful submission

---

## Phase 5: API Integration

### 5.1 API Client

Rewrite for web:

- Use Axios (same as existing) but remove React Native Platform imports
- Base URL from `NEXT_PUBLIC_API_BASE_URL` env variable
- Request interceptor for JWT token injection
- Response interceptor for 401 handling + token refresh
- Remove offline queue (not needed for web MVP)

### 5.2 Endpoints

```typescript
// Auth
POST /api/v1/auth/login/access-token  // Login with phone + password
POST /api/v1/auth/login/otp          // Request OTP (optional)
POST /api/v1/auth/verify-otp         // Verify OTP

// Property
POST /api/v1/properties              // Create property
GET  /api/v1/properties/:id         // Get property status
PUT  /api/v1/properties/:id          // Update property
POST /api/v1/properties/:id/photos  // Upload photos

// Valuation
GET  /api/v1/valuations/:propertyId // Get valuation result
```

### 5.3 WebSocket Events

- `property:updated` - Status changes
- `valuation:complete` - Valuation finished
- `follow-up:required` - Additional info needed

---

## Phase 6: Styling & Theming

### 6.1 Use Existing Theme Package

Import from `@propflow/theme`:

- colors, spacing, typography
- borderRadius, shadow, layout
- glass effects

### 6.2 Component Styling Pattern

Follow valuer-dashboard inline style pattern:

```typescript
const cardStyle: React.CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: borderRadius.xl,
  boxShadow: shadow.md,
  padding: spacing[6],
};
```

### 6.3 Animations

Use Framer Motion for:

- Page transitions (slide/fade)
- Card hover effects
- Button interactions
- Loading states
- Success celebrations

### 6.4 Responsive Breakpoints

```typescript
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(max-width: 1024px)');
```

### 6.5 Key Style Patterns (from Valuer Dashboard)

**Layout Pattern:**

```
Dark gradient background → Sidebar (glass.dark) → Content card (rounded, white, elevated)
```

**Color Usage:**

- **Primary actions:** `linear-gradient(135deg, primary[500], primary[600])` with `shadow.brand`
- **Text hierarchy:** gray[900] heading → gray[700] body → gray[500] muted
- **Borders:** `colors.border` (#E5E7EB)
- **Focus rings:** `primary[500]` border + `primary[100]` outer glow

**Component Styling:**

- **Buttons:** Full-width gradient, `borderRadius.lg`, `fontWeight.semibold`
- **Inputs:** Icon + input wrapper, `borderRadius.lg`, 1.5px border, focus ring
- **Cards:** `borderRadius['2xl']`, `shadow.xl`, `padding: spacing[10]`
- **Badges:** `borderRadius.base`, small font, colored background + border

**Animations:**

- **Page transitions:** Framer-motion fade + slide
- **Buttons:** `whileHover`, `whileTap` with scale
- **Sidebar:** Spring-based slide-in/out
- **Loading:** Skeleton placeholders with shimmer

---

## Things NOT to Carry Over from React Native App

| Feature                        | Why                                               |
| ------------------------------ | ------------------------------------------------- |
| `expo-camera`                  | Use `<input type="file" capture>` instead         |
| `expo-location`                | Use `navigator.geolocation` API instead           |
| `expo-haptics`                 | No web equivalent needed                          |
| `react-native-maps`            | Use `react-leaflet` (already in valuer dashboard) |
| `expo-secure-store`            | Use `localStorage` (web)                          |
| `AsyncStorage`                 | Use `localStorage` (web)                          |
| Offline queue                  | Not needed for web MVP                            |
| `react-native-reanimated`      | Use `framer-motion` instead                       |
| `react-native-gesture-handler` | Use native web events                             |
| `@react-navigation`            | Use Next.js App Router                            |
| `react-native-*`               | No RN primitives (use HTML/CSS)                   |

---

## Phase 7: Cleanup Tasks

### 7.1 Remove Mobile App Code

**Delete the following:**

- `frontend/apps/customer-app/` (entire directory - includes iOS/Android directories and Expo configs)
- `.expo/` directory if exists
- Expo-specific config files (app.json, eas.json, babel.config.js in customer app)

### 7.2 Remove Mobile CI/CD Jobs

Update workflow files to remove mobile build jobs:

| File                                 | Remove                   |
| ------------------------------------ | ------------------------ |
| `.github/workflows/ci.yml`           | `mobile` job             |
| `.github/workflows/deploy.yml`       | `build-mobile` job       |
| `.github/workflows/deploy-local.yml` | `build-mobile-local` job |

### 7.3 Update Scripts & Docs

- Update `scripts/dev-start.sh` to use customer portal env setup
- Update docs: README.md, SETUP-GUIDE.md, onboarding docs
- Remove references to: `expo`, `react-native`, `eas`, `run:android`, `run:ios`

### 7.4 Cleanup Checklist

- [ ] Delete `frontend/apps/customer-app/` entirely
- [ ] Remove mobile CI job from `.github/workflows/ci.yml` (`mobile` job)
- [ ] Remove mobile deploy job from `.github/workflows/deploy.yml` (`build-mobile` job)
- [ ] Remove local mobile build job from `.github/workflows/deploy-local.yml` (`build-mobile-local` job)
- [ ] Update local bootstrap script: `scripts/dev-start.sh`
- [ ] Update docs references from mobile to web
- [ ] Ensure no remaining references to `expo`, `react-native`, `eas`, `run:android`, `run:ios` in active app/workflow paths
- [ ] Run `pnpm install` to clean up lockfile

---

## Phase 8: Testing & Quality

### 8.1 Unit Tests

- Component tests with Vitest
- Store tests
- API client tests

### 8.2 E2E Tests

- Copy Playwright config from valuer-dashboard
- Full valuation flow
- Error scenarios
- Mobile responsiveness

### 8.3 Accessibility

- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### 8.4 Acceptance Test Matrix

| Area         | Test                              | Expected outcome                                 |
| ------------ | --------------------------------- | ------------------------------------------------ |
| Auth         | phone entry + OTP verify/login    | user lands on protected route with valid session |
| Wizard       | end-to-end submission             | property created and reaches submitted state     |
| Drafts       | refresh/reopen mid-flow           | draft restored correctly from local storage      |
| Photos       | upload + remove + re-upload       | final payload contains intended images only      |
| Location     | geolocation denied path           | manual pin/address entry still works             |
| Status       | websocket update event            | status UI updates without full reload            |
| Responsive   | mobile/tablet/desktop breakpoints | no blocking layout regressions                   |
| Decommission | CI workflow run                   | no job tries to build Android/iOS                |

### 8.5 Non-Functional Quality Gates (NFRs)

1. **Performance**
   - Initial route should avoid heavy client bundles and unnecessary blocking requests
   - Image upload path should be resilient for low-bandwidth users

2. **Accessibility**
   - Keyboard-accessible forms and controls
   - Visible focus states and semantic labels for all core actions

3. **Security**
   - No token leakage in logs
   - Auth tokens stored and handled consistently with existing app policies

4. **Reliability**
   - Draft recovery works after refresh/tab close
   - Websocket disconnect/reconnect does not break status tracking

---

## Implementation Order

| Phase     | Description                                     | Est. Time   |
| --------- | ----------------------------------------------- | ----------- |
| **1**     | Scaffolding + remove old app                    | 1 hr        |
| **2**     | Core layout (ClientLayout, Sidebar, TopBar)     | 2 hrs       |
| **3**     | Authentication (login page, auth store, guards) | 1.5 hrs     |
| **4**     | Multi-step valuation flow (5 pages + stepper)   | 4 hrs       |
| **5**     | Property status & results pages                 | 2.5 hrs     |
| **6**     | API & services layer                            | 1 hr        |
| **7**     | Supporting components                           | 1 hr        |
| **8**     | Polish, responsive, animations, SEO             | 1 hr        |
| **9**     | Cleanup CI/CD + docs                            | 1 hr        |
| **10**    | Testing & quality                               | 2 hrs       |
| **Total** |                                                 | **~16 hrs** |

---

## Sprint Breakdown

- **Sprint 1**: Phases 1-3 (scaffold + layout + auth)
- **Sprint 2**: Phases 4-5 (valuation wizard + status/results)
- **Sprint 3**: Phases 6-9 (API + components + cleanup + polish)
- **Sprint 4**: Phase 10 (testing + staging UAT + production release)

---

## Key Decisions Required

1. **Auth mode**: OTP-first vs phone+password-first (with OTP fallback)
2. **Photo acquisition strategy**: upload-only vs upload + web camera capture
3. **Map behavior**: Leaflet only vs adding third-party geocoding/autocomplete provider
4. **PWA scope**: installable app behavior needed at launch or deferred
5. **Analytics**: launch with tracking baseline or add post-MVP
6. **Cutover strategy**: big-bang switch vs staged rollout with feature flag

---

## Risk Mitigation

| Risk                                                 | Mitigation                                                       |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| Browser compatibility for camera                     | Provide file upload fallback                                     |
| Geolocation permissions                              | Clear permission request UI                                      |
| Large photo uploads                                  | Implement compression and chunked upload + retry                 |
| Session timeout                                      | Refresh tokens and auto-login                                    |
| Auth mismatch between OTP flow and web               | Finalize auth mode before implementation, keep OTP fallback      |
| Camera/location behavior differences across browsers | Support both direct capture and manual upload; graceful fallback |
| Style drift from valuer dashboard                    | Build from copied layout/component primitives first              |
| CI breakage from mobile job removal                  | Remove references in all workflow files in one PR                |
| Large image uploads causing timeouts                 | Client-side compression + upload progress + retry                |
| Geolocation/browser permission fragmentation         | Graceful fallback to manual coordinates/address, clear messaging |
| Draft recovery on refresh                            | localStorage persistence + proper hydration                      |

---

## Environment Variables

```env
# .env.example
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_APP_NAME=PropFlow Customer Portal
NEXT_PUBLIC_APP_PORT=3001
```

---

## Success Criteria

The migration is complete when **all** are true:

1. ✅ Customer journey works fully on web (login → new valuation → submit → track → result/follow-up)
2. ✅ UI clearly matches valuer dashboard frontend style
3. ✅ `frontend/apps/customer-app/` no longer exists
4. ✅ No CI/CD workflow references iOS/Android/Expo/EAS builds
5. ✅ Docs and local setup instructions mention customer website, not mobile app
6. ✅ Monorepo lint/type-check/test/build pass
7. ✅ Responsive on mobile, tablet, and desktop
8. ✅ E2E tests pass for critical customer journey
9. ✅ Customer web app runs successfully on `localhost:3001`
10. ✅ Route-by-route UAT acceptance criteria signed off

---

## Route-by-Route Acceptance Criteria

Use this as UAT signoff criteria (beyond unit/e2e tests):

| Route                      | Source screen(s) parity                    | Must-have acceptance                                             |
| -------------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| `/login`                   | `WelcomeScreen` + `OTPScreen`              | successful auth persists session and redirects to protected area |
| `/new`                     | `PropertyTypeScreen`                       | property type selection persists and advances correctly          |
| `/new/details`             | `PropertyDetailsScreen`                    | validation parity and save/continue behavior works               |
| `/new/location`            | `LocationScreen`                           | geolocation + manual fallback + draggable map marker work        |
| `/new/photos`              | `PhotoCaptureScreen` + `PhotoReviewScreen` | upload/remove/review flow works across mobile and desktop        |
| `/new/review`              | `SubmitScreen`                             | summary correctness, edit links, submit success path             |
| `/`                        | dashboard listing equivalent               | list loads, status filters work, empty state is usable           |
| `/property/[id]`           | `StatusScreen`                             | timeline and websocket-based status refresh are functional       |
| `/property/[id]/result`    | `ValuationResultScreen`                    | value, confidence, comparables render correctly                  |
| `/property/[id]/follow-up` | `FollowUpScreen`                           | follow-up upload/edit/submit path works                          |

---

## Release Evidence Checklist

Attach to PR/hand-off:

- [ ] Screenshots/video for: login, each wizard step, property detail, result, follow-up
- [ ] Output of monorepo checks: lint, type-check, test, build
- [ ] Confirmation that all 3 workflow files no longer contain mobile jobs
- [ ] Confirmation that `frontend/apps/customer-app/` is deleted
- [ ] Short rollback note with commit/tag to revert to if needed

---

## Decommission Verification Commands

Run these before merge to ensure mobile removal is complete:

```bash
grep -R "customer-app" .github/workflows scripts README.md SETUP-GUIDE.md || true
grep -R "expo\|react-native\|eas\|run:android\|run:ios" frontend apps scripts .github || true
test ! -d frontend/apps/customer-app && echo "customer-app removed"
```

Then run full checks:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

---

## Immediate Next Actions

1. Approve app name (`customer-portal`) and auth mode
2. Start Phase 1 scaffolding from valuer-dashboard baseline
3. After customer portal shell is running, begin screen-by-screen migration from current customer app
4. Perform mobile decommission only after the web replacement is functionally complete in staging

---

## Open Decisions to Close This Week

1. Confirm auth UX: OTP-only vs password+OTP hybrid
2. Confirm whether customer web includes profile/history in MVP or post-MVP
3. Confirm whether PWA installability is required at initial release
4. Confirm whether analytics and event taxonomy are part of MVP
5. Confirm whether rollout is phased (feature flag) or direct replacement

---

## Migration Inventory Checklist

### Mobile-only items to remove

- Expo config and build files (`app.json`, `eas.json`, `babel.config.js` in customer app)
- Native directories (`ios/`, `android/` under customer app)
- React Native / Expo dependencies in customer app package.json
- CI and deploy jobs that run Android or EAS builds

### Web replacements

- `react-navigation` → Next.js App Router
- `react-native-maps` → `react-leaflet`
- `expo-location` → browser geolocation
- `expo-camera` → file input + capture + drag/drop
- secure/async storage → browser localStorage patterns
- haptics → web motion/interaction feedback

---

## Notes

- The **customer portal** and **valuer dashboard** share the same backend API but serve different roles
- Auth tokens are role-based — customer login returns a `CUSTOMER` role user
- Both apps should be runnable simultaneously (different ports: 3000 for valuer, 3001 for customer)
- The shared `@propflow/theme` package ensures visual consistency across both apps
- Consider setting up API proxy in `next.config.js` for CORS (same as valuer dashboard)
