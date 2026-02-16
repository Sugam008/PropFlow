# Plan: Convert Customer App to Website (Matching Valuer Dashboard Style)

## Overview

Convert the existing React Native/Expo customer app into a Next.js web application that matches the frontend styling and patterns of the valuer-dashboard. Remove iOS and Android native code.

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

- **Tech Stack**: React Native (Expo) - Decommissioned
- **Location**: `frontend/apps/customer-app/`
- **Screens**:
  - Auth: WelcomeScreen, OTPScreen
  - Main: PropertyTypeScreen, PropertyDetailsScreen, LocationScreen, PhotoCaptureScreen, PhotoReviewScreen, SubmitScreen, StatusScreen, ValuationResultScreen, FollowUpScreen
- **Styling**: React Native StyleSheet, theme tokens from `@propflow/theme`
- **Navigation**: Native stack navigator
- **State**: Zustand stores (useAuthStore, usePropertyStore, useUIStore)

### Valuer Dashboard (Next.js)

- **Tech Stack**: Next.js 14+, React, Tailwind-style inline styles, Framer Motion
- **Location**: `frontend/apps/valuer-dashboard/`
- **Layout**: Sidebar navigation + TopBar header
- **Styling**: Inline CSS with theme tokens from `@propflow/theme`, glass effects, animations
- **Components**: Card, Badge, Table, Modal, Sidebar, TopBar
- **Libraries**: framer-motion, lucide-react, leaflet, @tanstack/react-query

### Shared Packages

- `@propflow/theme` — Design tokens (colors, spacing, typography, glass, shadows)
- `@propflow/types` — Shared TypeScript enums & interfaces
- `@propflow/ui` — Shared UI components
- `@propflow/utils` — Shared utilities

---

## Architecture Decision Matrix

| Decision Area | Choice                                                 | Rationale                                         |
| ------------- | ------------------------------------------------------ | ------------------------------------------------- |
| Framework     | **Next.js 16 (App Router)**                            | Matches valuer dashboard architecture exactly     |
| Styling       | **Inline styles + `@propflow/theme` tokens**           | Maximum visual parity with valuer dashboard       |
| Animations    | **`framer-motion`**                                    | Already used in valuer dashboard                  |
| Icons         | **`lucide-react`**                                     | Shared icon language with valuer dashboard        |
| Maps          | **`react-leaflet`**                                    | Already present in dashboard stack                |
| Location      | **Browser Geolocation API**                            | Web-native replacement for `expo-location`        |
| Photos        | **File input + drag/drop** (+ optional camera capture) | Web-native replacement for `expo-camera`          |
| State         | **Zustand + localStorage persistence**                 | Aligns with dashboard and web expectations        |
| Data fetching | **React Query + Axios**                                | Existing project pattern                          |
| Port          | **3001**                                               | Avoid collision with valuer dashboard on 3000     |
| Auth          | **Phone + Password** (same as valuer)                  | Simpler for web, matches valuer dashboard pattern |

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

## Target Architecture

### New Customer Web App Structure

```
frontend/apps/customer-portal/
├── app/
│   ├── layout.tsx                  # Root layout (Inter font, providers, metadata)
│   ├── globals.css                 # Global styles + animations
│   ├── page.tsx                    # My Properties listing (home)
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── new/
│   │   ├── page.tsx               # Step 1: Property Type selection
│   │   ├── details/
│   │   │   └── page.tsx           # Step 2: Property Details form
│   │   ├── location/
│   │   │   └── page.tsx           # Step 3: Location + Map
│   │   ├── photos/
│   │   │   └── page.tsx           # Step 4: Photo Upload
│   │   └── review/
│   │       └── page.tsx           # Step 5: Review & Submit
│   ├── property/
│   │   └── [id]/
│   │       ├── page.tsx           # Property Status page
│   │       ├── result/
│   │       │   └── page.tsx       # Valuation Result
│   │       └── follow-up/
│   │           └── page.tsx       # Follow-up actions
│   ├── help/
│   │   └── page.tsx               # Help & Support
│   └── api/
│       └── proxy/
│           └── [...path]/
│               └── route.ts        # API proxy if needed
├── src/
│   ├── api/
│   │   ├── client.ts              # Axios client (web-native)
│   │   ├── auth.ts                # Auth API calls
│   │   └── property.ts            # Property API calls
│   ├── components/
│   │   ├── ClientLayout.tsx       # Sidebar + TopBar + content wrapper
│   │   ├── Sidebar.tsx           # Customer navigation sidebar
│   │   ├── TopBar.tsx             # Header with search + user
│   │   ├── Stepper.tsx            # Multi-step progress indicator
│   │   ├── FileUpload.tsx         # Drag-and-drop photo upload
│   │   ├── PhotoGrid.tsx          # Photo preview grid
│   │   ├── PropertyCard.tsx       # Property listing card
│   │   ├── StatusTimeline.tsx     # Status progress timeline
│   │   ├── ConfidenceMeter.tsx    # Circular confidence score
│   │   ├── Badge.tsx              # Status badges
│   │   ├── Card.tsx               # Reusable card component
│   │   ├── Modal.tsx              # Dialog component
│   │   ├── MapView.tsx            # Leaflet map
│   │   ├── ErrorBoundary.tsx      # Error boundary
│   │   └── PageTransition.tsx     # Route transition animation
│   ├── forms/
│   │   ├── PhoneInput.tsx         # Phone input with country code
│   │   ├── OTPInput.tsx          # OTP digit inputs
│   │   ├── AddressForm.tsx       # Address fields group
│   │   └── PropertyDetailsForm.tsx # Property detail fields group
│   ├── hooks/
│   │   ├── useMediaQuery.ts       # Responsive breakpoint hook
│   │   └── useGeolocation.ts      # Browser geolocation hook
│   ├── providers/
│   │   ├── QueryProvider.tsx      # React Query setup
│   │   ├── ToastProvider.tsx      # Toast notification provider
│   │   └── WebSocketProvider.tsx  # Real-time WebSocket provider
│   ├── services/
│   │   └── analytics.ts          # Analytics service
│   └── store/
│       ├── useAuthStore.ts        # Auth state (Zustand + localStorage)
│       └── usePropertyStore.ts    # Property draft state (Zustand + localStorage)
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

---

## Phase 1: Setup & Infrastructure (~1 hour)

### 1.1 Create New Next.js App

- Initialize new app: `npx create-next-app@latest customer-portal --typescript --app`
- Copy configuration patterns from valuer-dashboard:
  - `next.config.js` (with PWA support)
  - `tsconfig.json`
  - `eslint.config.mjs`
  - `.env.example`
- Set up `package.json` with same dependencies as valuer dashboard:
  - `next`, `react`, `react-dom`
  - `framer-motion`, `lucide-react`
  - `zustand`, `axios`
  - `@tanstack/react-query`
  - `leaflet`, `react-leaflet`, `@types/leaflet`
  - `@propflow/theme`, `@propflow/types`, `@propflow/ui`, `@propflow/utils`
  - `@ducanh2912/next-pwa`

### 1.2 Setup Theme & Shared Packages

- Reuse `@propflow/theme` package (already exists)
- Ensure all theme tokens are available

### 1.3 Copy Shared Code

- Copy `src/store/useAuthStore.ts` from customer-app
- Copy `src/store/usePropertyStore.ts` from customer-app (adapt for web)
- Copy `src/api/` from customer-app
- Copy `src/services/analytics.ts` from customer-app

---

## Phase 2: Layout & Navigation (~2 hours)

### 2.1 Create App Layout

- Create `app/layout.tsx` with:
  - HTML structure with Inter font from `next/font/google`
  - Providers: QueryProvider, ToastProvider, WebSocketProvider, ErrorBoundary
  - Body background: `colors.gray[50]`
  - Metadata for SEO (title: "PropFlow Customer Portal | Aditya Birla Capital")

### 2.2 Implement Sidebar Navigation

- Create `src/components/layout/Sidebar.tsx` based on valuer-dashboard pattern
- Dark gradient background → Sidebar (glass.dark)
- Menu items:
  - 🏠 **New Valuation** → `/new` (the multi-step flow)
  - 📋 **My Properties** → `/` (list of submitted properties)
  - 📊 **Track Status** → `/track`
- Glass dark theme: `rgba(17, 24, 39, 0.85)`
- Animated expand/collapse
- Same PropFlow branding with Aditya Birla sun logo
- Subtitle: "Customer Portal" (instead of "Valuer Dashboard")

### 2.3 Create TopBar

- Create `src/components/layout/TopBar.tsx`
- Same `glass.light` header with search bar
- Page title changes based on route
- User avatar + notification bell
- Mobile hamburger menu

### 2.4 Public vs Protected Routes

- Public: `/login` (phone + OTP)
- Protected: All valuation routes (require authentication)
- Auth guard with skeleton during hydration to prevent flash

---

## Phase 3: Authentication (~1.5 hours)

### 3.1 Login Page (`/login`)

- Same visual design as valuer dashboard: White card on gray gradient background
- Same input styling: Icon + input wrapper with focus ring
- Same brand gradient button: `linear-gradient(135deg, primary[500], primary[600])`
- Fields: Phone number + OTP (or phone + password, matching backend auth endpoint)
- Demo credentials section (Customer: `+919999900001 / demo123`)
- Error states with red alert box (same as valuer dashboard)
- Loader2 spinner animation on submit

### 3.2 Session Management

- Store auth token in localStorage (or cookies for SSR)
- Reuse `useAuthStore` from customer-app with storage key: `propflow-customer-auth`
- Auto-redirect to home if authenticated

---

## Phase 4: Valuation Flow Screens (~4 hours)

### 4.1 Stepper Component (`src/components/Stepper.tsx`)

Create a premium stepper/progress indicator:

- Steps: Property Type → Details → Location → Photos → Review → Submit
- Visual style: horizontal progress bar with numbered steps
- Active step highlighted with `primary[500]` gradient
- Completed steps with checkmark and `success[500]`
- Animated transitions between steps using framer-motion
- Responsive: horizontal on desktop, vertical on mobile

### 4.2 Property Type (`/new`)

- Convert `PropertyTypeScreen.tsx`
- Card grid with hover animations
- Selection highlight with primary color
- Auto-navigate on selection or "Next" button
- Mobile: 2 columns, Desktop: 3-5 columns
- Use `framer-motion` for hover/tap animations (instead of RN Haptics)

### 4.3 Property Details (`/new/details`)

- Convert `PropertyDetailsScreen.tsx`
- Form fields: Area (sqft), Bedrooms, Bathrooms, Floor, Total Floors, Age
- Same validation logic with inline error messages
- Input styling matches valuer dashboard login inputs
- Two-column layout for desktop
- Back/Next navigation buttons styled with brand gradient

### 4.4 Location (`/new/location`)

- Convert `LocationScreen.tsx`
- Replace `react-native-maps` with `react-leaflet`
- Replace `expo-location` with Browser Geolocation API (`navigator.geolocation`)
- Address fields: Full Address, City, State, Pincode
- "Use My Location" button with GPS pin animation
- Map view with draggable marker

### 4.5 Photo Upload (`/new/photos`)

- Convert `PhotoCaptureScreen.tsx` + `PhotoReviewScreen.tsx`
- Replace `expo-camera` with web alternatives:
  - `<input type="file" accept="image/*" capture="environment">` for mobile camera access
  - Drag-and-drop zone for desktop uploads
- Photo preview grid with remove buttons
- Upload progress indicator
- Min/max photo count validation
- Image thumbnails with lightbox preview

### 4.6 Review & Submit (`/new/review`)

- Convert `SubmitScreen.tsx`
- Summary card showing all entered data
- Property type badge, address, details, photo count
- "Edit" links back to each section
- Terms checkbox
- Submit button with loading state
- Confetti/success animation on successful submission

---

## Phase 5: History & Results (~2.5 hours)

### 5.1 My Properties Page (`/`)

- Main dashboard showing submitted properties
- Styled as card list matching valuer dashboard's queue page design
- Cards with: Property type badge, address, submission date, status badge
- Status badges colored: Draft (gray), Submitted (blue), Under Review (yellow), Valued (green), Rejected (red)
- Click to view details/result
- Empty state with illustration
- Sorting/filtering by status

### 5.2 Property Detail / Status Page (`/property/[id]`)

- Convert `StatusScreen.tsx`
- Property info card (same layout as valuer dashboard detail page)
- Status timeline with animated progress steps
- WebSocket integration for real-time status updates
- Follow-up items section (if status is FOLLOW_UP)
- Share valuation link

### 5.3 Valuation Result Page (`/property/[id]/result`)

- Convert `ValuationResultScreen.tsx`
- Premium result display:
  - Large estimated value with INR formatting
  - Confidence score as animated circular progress (ConfidenceMeter)
  - Methodology description
  - Comparable properties section with mini cards
  - Download/Share result buttons
  - Apply for loan CTA
- Styled with glassmorphism cards and gradients

### 5.4 Follow-Up Page (`/property/[id]/follow-up`)

- Convert `FollowUpScreen.tsx`
- Follow-up items list with status indicators
- Re-upload photos functionality
- Additional document upload
- Information correction form
- Submit follow-up button

---

## Phase 6: Component Library (~1 hour)

### 6.1 Reusable UI Components

Create web versions of components following valuer-dashboard patterns:

| Component       | Description                                        |
| --------------- | -------------------------------------------------- |
| Button          | Primary, Secondary, Ghost variants; sizes sm/md/lg |
| Input           | Text, Number, Select; with label, error states     |
| Card            | White/Glass variants; with header, body, footer    |
| Badge           | Status indicators with colors                      |
| Modal           | Centered overlay with animations                   |
| FileUpload      | Drag & drop zone with preview                      |
| PhotoGallery    | Grid of images with lightbox                       |
| Progress        | Step indicator for valuation flow                  |
| Toast           | Success, Error, Warning, Info notifications        |
| Stepper         | Multi-step progress indicator                      |
| ConfidenceMeter | Circular progress for valuation confidence         |
| PropertyCard    | Property summary card for listings                 |
| StatusTimeline  | Vertical timeline for property status              |

### 6.2 Form Components

- PhoneInput (with country code)
- OTPInput (individual digit inputs)
- AddressForm
- PropertyDetailsForm

---

## Phase 7: API Integration (~1 hour)

### 7.1 Reuse Existing API Client

- Copy `src/api/` from customer-app
- Adapt for web (use axios but remove React Native Platform imports)
- Add proper error handling with toast notifications
- Use React Query for data fetching

### 7.2 WebSocket Integration

- Real-time status updates
- Reuse WebSocketProvider pattern from valuer-dashboard

### 7.3 File Upload

- Handle multipart form data
- Progress indication
- Error retry logic

---

## Phase 8: Remove Mobile App Code (~1 hour)

### 8.1 Delete Entire Customer App

> **Note:** Retain `customer-app/src/` temporarily during migration for reference. Delete _after_ web implementation is complete and verified.

- Delete `frontend/apps/customer-app/` entirely (including `ios/`, `android/`, `.expo/`, `eas.json`, `app.json`)

### 8.2 CI/CD Cleanup

- Remove mobile CI job from: `.github/workflows/ci.yml` (`mobile` job)
- Remove mobile deploy job from: `.github/workflows/deploy.yml` (`build-mobile` job)
- Remove local mobile build job from: `.github/workflows/deploy-local.yml` (`build-mobile-local` job)
- Update local bootstrap script: `scripts/dev-start.sh` to use customer web app env setup
- Update docs references from mobile to web:
  - `README.md`
  - `SETUP-GUIDE.md`
  - Onboarding docs that mention Expo/Android/iOS
- Ensure no remaining references to `expo`, `react-native`, `eas`, `run:android`, `run:ios` in active app/workflow paths

---

## Phase 9: Polish & Responsive Design (~1 hour)

### 9.1 Responsive Design

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Sidebar collapses to hamburger menu on mobile (≤1024px)
- Stepper goes from horizontal to vertical on mobile

### 9.2 Animations

- Use Framer Motion for page transitions (fade + slide)
- Micro-interactions on buttons/inputs
- Loading skeletons matching valuer dashboard pattern
- Toast notifications with slide-in/out
- Success confetti on property submission

### 9.3 SEO & Meta

- Per-page title tags
- Meta descriptions for public pages
- Open Graph tags
- `robots.txt`, `sitemap.xml`
- Favicon and PWA icons
- PWA manifest for installability

### 9.4 Accessibility

- Proper ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

---

## Phase 10: Testing & Quality (~2 hours)

### 10.1 Unit Tests

- Component tests with Vitest
- Store tests
- API client tests

### 10.2 E2E Tests

- Copy playwright config from valuer-dashboard
- Write tests for critical flows:
  - Login flow
  - Full valuation submission
  - Status checking
  - History viewing

### 10.3 Acceptance Test Matrix

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

## Key Style Patterns to Follow (from Valuer Dashboard)

### 1. Layout Pattern

```
Dark gradient background → Sidebar (glass.dark) → Content card (rounded, white, elevated)
```

### 2. Color Usage

- **Primary actions:** `linear-gradient(135deg, primary[500], primary[600])` with `shadow.brand`
- **Text hierarchy:** gray[900] heading → gray[700] body → gray[500] muted
- **Borders:** `colors.border` (#E5E7EB)
- **Focus rings:** `primary[500]` border + `primary[100]` outer glow

### 3. Component Styling

- **Buttons:** Full-width gradient, `borderRadius.lg`, `fontWeight.semibold`
- **Inputs:** Icon + input wrapper, `borderRadius.lg`, 1.5px border, focus ring
- **Cards:** `borderRadius['2xl']`, `shadow.xl`, `padding: spacing[10]`
- **Badges:** `borderRadius.base`, small font, colored background + border

### 4. Animations

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

## Implementation Order & Time Estimates

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

## File Mapping (Customer App → Customer Web)

| Original (RN)                                | Target (Next.js)                             |
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

---

## Risk Mitigation

| Risk                                                 | Mitigation                                                       |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| Browser compatibility for camera                     | Provide file upload fallback                                     |
| Geolocation permissions                              | Clear permission request UI                                      |
| Large photo uploads                                  | Implement compression and chunked upload                         |
| Session timeout                                      | Refresh tokens and auto-login                                    |
| Auth mismatch between OTP flow and web               | Finalize auth mode before implementation, keep OTP fallback      |
| Camera/location behavior differences across browsers | Support both direct capture and manual upload; graceful fallback |
| Style drift from valuer dashboard                    | Build from copied layout/component primitives first              |
| CI breakage from mobile job removal                  | Remove references in all workflow files in one PR                |
| Large image uploads causing timeouts                 | Client-side compression + upload progress + retry                |

---

## Non-Functional Quality Gates (NFRs)

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
