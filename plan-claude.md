# Customer App → Website Conversion Plan

> **Executor Model:** Gemini 3 Flash (Dec 2025)
> **Thinking Level:** `high` for all phases (complex multi-step migration)
> **Temperature:** `1.0` (default, optimized for Gemini 3 reasoning)

---

## Agent Execution Strategy (Gemini 3 Flash Tuning)

This plan is designed to be executed by **Gemini 3 Flash** in an agentic coding environment (Gemini CLI, Google Antigravity, or similar). The following guidelines are critical for successful execution.

### Model Profile

| Attribute           | Value                                            |
| ------------------- | ------------------------------------------------ |
| Context window      | 1,000,000 tokens (input)                         |
| Max output          | 65,536 tokens per response                       |
| SWE-bench Verified  | 78% (outperforms Gemini 3 Pro at agentic coding) |
| Thinking levels     | minimal / low / medium / high                    |
| Optimal temperature | 1.0 (do not change)                              |

### GEMINI.md Setup (Do This First)

Before starting any phase, create a `GEMINI.md` file in the project root to anchor the agent's context:

```markdown
# GEMINI.md — PropFlow Customer Portal Migration

## Project

Monorepo: pnpm workspaces. Backend: FastAPI (Python).

- **Mobile**: (Legacy) React Native + Expo (Removed).
- **Web**: Next.js 16 (App Router).

## Active Task

Converting `frontend/apps/customer-app` (React Native/Expo) → `frontend/apps/customer-portal` (Next.js 16).
Target style: match `frontend/apps/valuer-dashboard` exactly.

## Tech Stack (customer-portal)

- Next.js 16 (App Router), React 19, TypeScript
- Zustand (state), Axios + React Query (data), framer-motion (animations)
- lucide-react (icons), react-leaflet (maps)
- Shared packages: @propflow/theme, @propflow/types, @propflow/ui, @propflow/utils

## Coding Conventions

- Inline CSS using @propflow/theme tokens (colors, spacing, typography, shadow, glass)
- No Tailwind. No CSS modules. No styled-components.
- Components: React.CSSProperties objects for styles, NOT className strings
- File naming: PascalCase for components, camelCase for hooks/utils/stores
- All components must be typed with TypeScript (no `any`)
- Use `'use client'` directive for client components

## Architecture Patterns (copy from valuer-dashboard)

- Root layout: `app/layout.tsx` with Inter font, metadata, providers
- Client layout: `src/components/ClientLayout.tsx` with sidebar + topbar + content
- Auth guard: redirect to /login if not authenticated, skeleton during hydration
- Stores: Zustand with `persist` middleware using localStorage
- API: Axios instance with interceptors for auth token + error handling

## MUST NOT

- Do NOT use any React Native or Expo imports
- Do NOT use Tailwind classes
- Do NOT create new shared packages — use existing @propflow/\* packages
- Do NOT modify backend code
- Do NOT modify the valuer-dashboard app
- Do NOT rewrite entire files for small changes — use focused edits

## Verification After Each Phase

Run these commands after completing each phase:

- `cd frontend/apps/customer-portal && npx tsc --noEmit` (type check)
- `pnpm lint` (from monorepo root)
- `pnpm build` (verify build succeeds)
```

### Task Decomposition Rules

Gemini 3 Flash excels at agentic coding but has known failure modes. Follow these rules:

1. **One phase at a time.** Do NOT attempt multiple phases in a single session. Complete one phase, verify, commit, then start the next.
2. **Small files, not monoliths.** Each component/page should be its own file. Never generate files longer than ~300 lines. Split into sub-components.
3. **Copy-then-adapt, not rewrite.** When the plan says "copy from valuer dashboard," literally copy the file first, then make targeted edits. Do NOT rewrite from scratch.
4. **Verify after every file.** Run `npx tsc --noEmit` after creating each significant file to catch type errors immediately, not at the end.
5. **No hallucinated imports.** Before importing from `@propflow/*`, check that the export actually exists. Read the package's `index.ts` first.
6. **Commit after each phase.** Use `git add -A && git commit -m "Phase N: description"` after each phase passes verification.

### Known Gemini 3 Flash Anti-Patterns to Avoid

| Anti-Pattern                             | Mitigation (embedded in plan)                                   |
| ---------------------------------------- | --------------------------------------------------------------- |
| Rewriting entire files for small changes | Plan specifies "copy file X, then change lines Y"               |
| Duplicating existing utilities           | Plan lists exact shared packages to import from                 |
| Losing context in long sessions          | Plan is split into independent phases with fresh sessions       |
| Getting stuck in error loops             | Each phase has explicit verification commands to break loops    |
| Hallucinating non-existent APIs          | Plan includes exact API endpoints from backend                  |
| Ignoring existing patterns               | GEMINI.md locks conventions; plan references exact source files |

---

## Overview

Convert the existing **React Native Expo customer app** (`frontend/apps/customer-app`) into a **Next.js web application** (`frontend/apps/customer-portal`) that follows the same frontend style, design system, and architecture as the **valuer dashboard** (`frontend/apps/valuer-dashboard`).

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

- **Framework:** React Native 0.73 + Expo 50
- **Navigation:** `@react-navigation/native-stack` (11 screens)
- **State:** Zustand stores (`useAuthStore`, `usePropertyStore`, `useUIStore`)
- **API:** Axios with offline queue, retry logic, token refresh
- **Auth:** OTP-based (phone → OTP → verify)
- **Storage:** `expo-secure-store` (auth), `@react-native-async-storage` (drafts)
- **Native Features:** Camera (`expo-camera`), Location (`expo-location`), Haptics, Maps (`react-native-maps`)

**Evidence from repo:**

- `frontend/apps/customer-app/package.json` — (Removed)
- `frontend/apps/customer-app/app.json` — (Removed)
- `frontend/apps/customer-app/eas.json` — (Removed)

### Valuer Dashboard (Next.js)

- **Framework:** Next.js 16 (App Router)
- **Styling:** Inline CSS with shared `@propflow/theme` tokens
- **Animations:** `framer-motion`
- **Icons:** `lucide-react`
- **State:** Zustand with `localStorage` persistence
- **API:** Direct `fetch` calls + Axios
- **Layout:** `ClientLayout` → Sidebar + TopBar + content area (glassmorphism dark gradient background)
- **Font:** Inter (Google Fonts)

**Style baseline files (agent MUST read these before Phase 2):**

- `frontend/apps/valuer-dashboard/app/layout.tsx`
- `frontend/apps/valuer-dashboard/src/components/ClientLayout.tsx`
- `frontend/apps/valuer-dashboard/src/components/Sidebar.tsx`
- `frontend/apps/valuer-dashboard/src/components/TopBar.tsx`
- `frontend/apps/valuer-dashboard/app/globals.css`

### Why This Migration Is Straightforward

Shared packages already exist for theme/types/ui/utils (`@propflow/theme`, `@propflow/types`, `@propflow/ui`, `@propflow/utils`), so style and data models can be reused directly. The valuer dashboard already defines the exact target style baseline.

### Shared Packages

- `@propflow/theme` — Design tokens (colors, spacing, typography, glass, shadows, etc.)
- `@propflow/types` — Shared TypeScript enums & interfaces
- `@propflow/ui` — Shared UI components
- `@propflow/utils` — Shared utilities

---

## Architecture Decision Matrix

| Decision Area | Choice                                                 | Rationale                                         |
| ------------- | ------------------------------------------------------ | ------------------------------------------------- |
| Framework     | **Next.js 16 (App Router)**                            | Matches valuer dashboard architecture exactly     |
| Styling       | **Inline CSS + `@propflow/theme` tokens**              | Maximum visual parity with valuer dashboard       |
| Animations    | **`framer-motion`**                                    | Already used in valuer dashboard                  |
| Icons         | **`lucide-react`**                                     | Shared icon language with valuer dashboard        |
| Maps          | **`react-leaflet`**                                    | Already present in dashboard stack                |
| Location      | **Browser Geolocation API**                            | Web-native replacement for `expo-location`        |
| Photos        | **File input + drag/drop** (+ optional camera capture) | Web-native replacement for `expo-camera`          |
| State         | **Zustand + localStorage persistence**                 | Aligns with dashboard and web expectations        |
| Data fetching | **React Query + Axios**                                | Existing project pattern                          |
| Port          | **3001** (configurable)                                | Avoids collision with valuer dashboard at 3000    |
| Auth          | **Phone + Password** (same as valuer)                  | Simpler for web, matches valuer dashboard pattern |

---

## Pre-Implementation Decision Gates

Close these decisions before writing production code:

1. **Auth mode**: OTP-first vs phone+password-first (with OTP fallback)
2. **Photo acquisition strategy**: upload-only vs upload + web camera capture (WebRTC)
3. **Map behavior**: Leaflet only vs adding third-party geocoding/autocomplete provider
4. **PWA scope**: installable app behavior needed at launch or deferred
5. **Analytics**: launch with tracking baseline or add post-MVP
6. **Cutover strategy**: big-bang switch vs staged rollout with feature flag

---

## Navigation IA Contract

Primary sidebar navigation — fix early and reuse across layout/tests/docs:

| Label                         | Route            | Notes                                   |
| ----------------------------- | ---------------- | --------------------------------------- |
| New Valuation                 | `/new`           | Starts wizard flow                      |
| My Properties                 | `/`              | Default landing for authenticated users |
| Track Status                  | `/property/[id]` | Usually reached from property list card |
| Help & Support (optional MVP) | `/help`          | Include only if MVP scope approves      |

### Public vs Protected Routes

- **Public:** `/login` (phone + OTP or phone + password)
- **Protected:** All other routes (require authentication)
- Auth guard with skeleton during hydration to prevent flash

---

## RN → Web Screen/File Mapping

| React Native Source                          | Website Target                                                     |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `App.tsx`                                    | `app/layout.tsx`                                                   |
| `src/navigation/AppNavigator.tsx`            | App Router route structure                                         |
| `src/screens/auth/WelcomeScreen.tsx`         | `app/login/page.tsx` (step 1)                                      |
| `src/screens/auth/OTPScreen.tsx`             | `app/login/page.tsx` (step 2)                                      |
| `src/screens/main/PropertyTypeScreen.tsx`    | `app/new/page.tsx`                                                 |
| `src/screens/main/PropertyDetailsScreen.tsx` | `app/new/details/page.tsx`                                         |
| `src/screens/main/LocationScreen.tsx`        | `app/new/location/page.tsx`                                        |
| `src/screens/main/PhotoCaptureScreen.tsx`    | `app/new/photos/page.tsx`                                          |
| `src/screens/main/PhotoReviewScreen.tsx`     | `app/new/photos/page.tsx`                                          |
| `src/screens/main/SubmitScreen.tsx`          | `app/new/review/page.tsx`                                          |
| `src/screens/main/StatusScreen.tsx`          | `app/property/[id]/page.tsx`                                       |
| `src/screens/main/ValuationResultScreen.tsx` | `app/property/[id]/result/page.tsx`                                |
| `src/screens/main/FollowUpScreen.tsx`        | `app/property/[id]/follow-up/page.tsx`                             |
| `src/store/useAuthStore.ts`                  | `src/store/useAuthStore.ts` (adapt for localStorage)               |
| `src/store/usePropertyStore.ts`              | `src/store/usePropertyStore.ts` (adapt for localStorage)           |
| `src/api/property.ts`                        | `src/api/property.ts` (copy, remove RN imports)                    |
| `src/api/client.ts`                          | `src/api/client.ts` (rewrite for web)                              |
| `src/providers/WebSocketProvider.tsx`        | `src/providers/WebSocketProvider.tsx` (copy from valuer dashboard) |
| `src/services/analytics.ts`                  | `src/services/analytics.ts` (copy)                                 |

---

## Detailed Execution Plan

> **⚡ Agent instruction:** Execute ONE phase per session. After each phase, run the verification commands, commit, then start a fresh session for the next phase. This prevents context degradation.

### Phase 1: Planning & Scaffolding (~1 hour)

> **Agent prompt hint:** "Create a new Next.js app in `frontend/apps/customer-portal/` by copying the structure from `frontend/apps/valuer-dashboard/`. Do NOT generate files from scratch — copy and adapt."

#### 1.1 Branch & Freeze

- Create migration branch: `git checkout -b feat/customer-web-migration`
- Create `GEMINI.md` in project root (contents specified above)

#### 1.2 Create New Next.js App

- Create `frontend/apps/customer-portal/` as a new Next.js app
- **Agent: READ these files first, then copy and adapt:**
  - `frontend/apps/valuer-dashboard/next.config.js`
  - `frontend/apps/valuer-dashboard/tsconfig.json`
  - `frontend/apps/valuer-dashboard/eslint.config.mjs`
  - `frontend/apps/valuer-dashboard/.env.example`
- Set up `package.json` with same dependencies as valuer dashboard:
  - `next`, `react`, `react-dom`
  - `framer-motion`, `lucide-react`
  - `zustand`, `axios`
  - `@tanstack/react-query`
  - `leaflet`, `react-leaflet`, `@types/leaflet`
  - `@propflow/theme`, `@propflow/types`, `@propflow/ui`, `@propflow/utils`
  - `@ducanh2912/next-pwa`

#### 1.3 Copy Shared Code (adapt for web)

- Copy `src/store/useAuthStore.ts` from customer-app → adapt storage to localStorage
- Copy `src/store/usePropertyStore.ts` from customer-app → adapt storage
- Copy `src/api/` from customer-app → remove RN imports
- Copy `src/services/analytics.ts` from customer-app

#### 1.4 Verification Checkpoint

```bash
cd frontend/apps/customer-portal && pnpm install
npx tsc --noEmit
pnpm build
git add -A && git commit -m "Phase 1: Scaffold customer-portal"
```

**Deliverable:** `customer-portal` runs locally with placeholder route.

---

### Phase 2: Core Layout & Design System (~2 hours)

> **Agent prompt hint:** "Read the following 5 files from valuer-dashboard first: layout.tsx, ClientLayout.tsx, Sidebar.tsx, TopBar.tsx, globals.css. Then create equivalent files in customer-portal with customer-specific labels. Do NOT redesign — match exactly."

#### 2.1 Root Layout (`app/layout.tsx`)

- **Agent: COPY `frontend/apps/valuer-dashboard/app/layout.tsx` first, then change:**
  - Title: "PropFlow Customer Portal | Aditya Birla Capital"
  - Description: customer-specific meta description
- Import Inter font from `next/font/google`
- Wrap with `QueryProvider`, `ToastProvider`, `WebSocketProvider`, `ErrorBoundary`

#### 2.2 Client Layout (`src/components/ClientLayout.tsx`)

- **Agent: COPY `frontend/apps/valuer-dashboard/src/components/ClientLayout.tsx` first, then change:**
  - Sidebar menu items (per Navigation IA Contract above)
  - Route title mappings for customer pages
- Keep: dark gradient background, rounded content card, glassmorphism, skeleton loading

#### 2.3 Sidebar (`src/components/Sidebar.tsx`)

- **Agent: COPY from valuer dashboard, then change:**
  - Subtitle: "Customer Portal" (not "Valuer Dashboard")
  - Menu items: New Valuation, My Properties, Help & Support
  - Keep: dark glassmorphism, PropFlow branding, user profile section, mobile responsive

#### 2.4 TopBar (`src/components/TopBar.tsx`)

- **Agent: COPY from valuer dashboard, then change:**
  - Route title mapping for customer pages (per Navigation IA Contract)

#### 2.5 Global Styles (`app/globals.css`)

- **Agent: COPY from valuer dashboard, add customer-specific animations if needed**

#### 2.6 Verification Checkpoint

```bash
cd frontend/apps/customer-portal
npx tsc --noEmit
pnpm dev  # visually verify shell matches valuer dashboard
git add -A && git commit -m "Phase 2: Core layout and design system"
```

**Deliverable:** Navigable shell that visually matches valuer dashboard.

---

### Phase 3: Authentication (~1.5 hours)

> **Agent prompt hint:** "Read `frontend/apps/valuer-dashboard/app/login/page.tsx` and `frontend/apps/valuer-dashboard/src/store/useAuthStore.ts`. Copy both to customer-portal and adapt for customer role."

#### 3.1 Login Page (`app/login/page.tsx`)

- **Agent: COPY from valuer dashboard login page, then change:**
  - Customer-specific copy/labels
  - Demo credentials: `+919999900001 / demo123`
- Keep: white card on gradient, icon + input styling, brand gradient button, error states

#### 3.2 Auth Store (`src/store/useAuthStore.ts`)

- **Agent: COPY from valuer dashboard auth store, then change:**
  - Storage key: `propflow-customer-auth` (not `propflow-valuer-auth`)
  - Role handling: `CUSTOMER` role
- Keep: Zustand + persist + localStorage, login/logout/setAuth methods

```typescript
// Expected interface shape:
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}
```

#### 3.3 Auth Guard in ClientLayout

- Same hydration check pattern as valuer dashboard
- Redirect to `/login` if not authenticated
- Show skeleton during hydration to prevent flash

#### 3.4 Verification Checkpoint

```bash
npx tsc --noEmit
pnpm dev  # test login flow end-to-end
git add -A && git commit -m "Phase 3: Authentication flow"
```

**Deliverable:** End-to-end login/logout flow working on web.

---

### Phase 4: Multi-Step Valuation Flow (~4 hours)

> **Agent prompt hint:** "This is the largest phase. Create each page as a separate file. Do NOT try to build all 5 pages in one response — build them one at a time: PropertyType → Details → Location → Photos → Review. Verify types after each file."

> **⚡ Agent: Split this into sub-sessions if context gets long.** Session 4a: Stepper + PropertyType + Details. Session 4b: Location + Photos. Session 4c: Review + PropertyStore.

#### 4.1 Stepper Component (`src/components/Stepper.tsx`)

- Steps: Property Type → Details → Location → Photos → Review → Submit
- Horizontal progress bar with numbered steps
- Active step: `primary[500]` gradient. Completed: checkmark + `success[500]`
- Responsive: horizontal on desktop, vertical on mobile

#### 4.2 Property Type Page (`app/new/page.tsx`)

**Current (RN):** Grid of property type cards with icons and selection
**Web version:**

- Card grid with framer-motion hover animations
- Selection highlight with `primary[500]` border
- Types: Apartment 🏢, Independent House 🏡, Villa 🏰, Commercial 🏬, Land/Plot 📍
- Responsive: 2 cols mobile, 3-5 cols desktop

#### 4.3 Property Details Page (`app/new/details/page.tsx`)

**Current (RN):** Form with property attributes and validation
**Web version:**

- Fields: Area (sqft), Bedrooms, Bathrooms, Floor, Total Floors, Age
- Input styling matches valuer dashboard (icon prefix, border with focus ring)
- Two-column layout desktop, single-column mobile
- "Save & Continue Later" option that persists draft

#### 4.4 Location Page (`app/new/location/page.tsx`)

**Current (RN):** `react-native-maps` with GPS capture
**Web version:**

- `react-leaflet` map with draggable marker
- Browser Geolocation API (`navigator.geolocation`)
- Address fields: Full Address, City, State, Pincode
- "Use My Location" button
- Graceful fallback if geolocation denied → manual entry still works

#### 4.5 Photo Upload Page (`app/new/photos/page.tsx`)

**Current (RN):** `expo-camera` capture + photo grid
**Web version:**

- `<input type="file" accept="image/*" capture="environment">` for mobile camera
- Drag-and-drop zone for desktop
- Photo type categorization: Exterior, Interior, Documents
- Upload progress, client-side compression, min/max count validation
- Preview grid with remove buttons and lightbox

#### 4.6 Review & Submit Page (`app/new/review/page.tsx`)

- Property summary card with all entered data
- "Edit" links back to each section
- Terms & conditions checkbox
- Submit button with loading state
- Confetti/success animation on submission

#### 4.7 Property Store (`src/store/usePropertyStore.ts`)

- **Agent: COPY from customer-app, then replace AsyncStorage → localStorage**
- Auto-save (30-second interval), draft recovery on refresh, clear on submit

```typescript
interface PropertyState {
  draft: PropertyDraft;
  photos: PhotoItem[];
  currentStep: number;
  isLoading: boolean;
  lastSaved: Date | null;
  setDraft: (data: Partial<PropertyDraft>) => void;
  addPhoto: (photo: PhotoItem) => void;
  removePhoto: (id: string) => void;
  setCurrentStep: (step: number) => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<boolean>;
  resetDraft: () => void;
}
```

#### 4.8 Verification Checkpoint

```bash
npx tsc --noEmit
pnpm dev  # walk through all 5 wizard steps manually
git add -A && git commit -m "Phase 4: Multi-step valuation wizard"
```

**Deliverable:** Customer can complete and submit valuation request entirely on web.

---

### Phase 5: Property Status & Results (~2.5 hours)

> **Agent prompt hint:** "Create 4 pages: home listing, property detail, valuation result, follow-up. Read the equivalent valuer-dashboard pages for style reference before starting."

#### 5.1 My Properties Page (`app/page.tsx`)

- Card list matching valuer dashboard queue page design
- Property cards: type badge, address, date, status badge
- Status colors: Draft (gray), Submitted (blue), Under Review (yellow), Valued (green), Rejected (red)
- Empty state with illustration, sorting/filtering by status

#### 5.2 Property Detail / Status Page (`app/property/[id]/page.tsx`)

- Property info card, status timeline with animated progress
- WebSocket integration for real-time status updates
- Follow-up items section (if status is FOLLOW_UP)

#### 5.3 Valuation Result Page (`app/property/[id]/result/page.tsx`)

- Large estimated value with INR formatting
- Confidence score as animated circular progress (ConfidenceMeter)
- Comparable properties section, Download PDF button, Apply for Loan CTA

#### 5.4 Follow-Up Page (`app/property/[id]/follow-up/page.tsx`)

- Follow-up items list with status indicators
- Re-upload photos, additional document upload, submit follow-up

#### 5.5 Verification Checkpoint

```bash
npx tsc --noEmit
pnpm dev  # verify all status/result pages render
git add -A && git commit -m "Phase 5: Property status and results"
```

**Deliverable:** Full post-submission customer journey available on web.

---

### Phase 6: API & Services Layer (~1 hour)

> **Agent prompt hint:** "Read customer-app's API files first. Copy to customer-portal and remove all React Native / Expo imports. Replace with web-native equivalents."

#### 6.1 API Client (`src/api/client.ts`)

- Axios, base URL from `NEXT_PUBLIC_API_BASE_URL`
- Request interceptor: JWT token. Response interceptor: 401 + refresh.
- Remove offline queue (not needed for web)

#### 6.2 API Endpoints

```typescript
// Auth
POST /api/v1/auth/login/access-token
POST /api/v1/auth/login/otp
POST /api/v1/auth/verify-otp
GET  /api/v1/users/me

// Properties
POST /api/v1/properties
GET  /api/v1/properties
GET  /api/v1/properties/:id
PUT  /api/v1/properties/:id
POST /api/v1/properties/:id/photos
POST /api/v1/properties/:id/submit
GET  /api/v1/valuations/:propertyId
```

#### 6.3 WebSocket Provider

- **Agent: COPY from valuer dashboard's WebSocket provider**
- Events: `property:updated`, `valuation:complete`, `follow-up:required`

#### 6.4 Verification Checkpoint

```bash
npx tsc --noEmit
git add -A && git commit -m "Phase 6: API and services layer"
```

---

### Phase 7: Component Library (~1 hour)

> **Agent prompt hint:** "Check what already exists in @propflow/ui before creating any component. Only create components that don't exist in shared packages."

#### 7.1 Reusable UI Components (adapt from valuer dashboard)

| Component        | Description                              |
| ---------------- | ---------------------------------------- |
| `Button`         | Primary, Secondary, Ghost; sm/md/lg      |
| `Input`          | Text, Number, Select; label, error, icon |
| `Card`           | White/Glass variants                     |
| `Badge`          | Status indicators                        |
| `Modal`          | Centered overlay with framer-motion      |
| `Toast`          | Success, Error, Warning, Info            |
| `ErrorBoundary`  | Error boundary wrapper                   |
| `PageTransition` | Framer-motion page transitions           |
| `MapView`        | Leaflet map component                    |

#### 7.2 Customer-Specific Components

| Component         | Description                                |
| ----------------- | ------------------------------------------ |
| `Stepper`         | Multi-step progress indicator              |
| `FileUpload`      | Drag-and-drop + file input with camera     |
| `PhotoGrid`       | Photo preview grid with remove/lightbox    |
| `PropertyCard`    | Property summary card for listings         |
| `StatusTimeline`  | Vertical timeline for property status      |
| `ConfidenceMeter` | Circular progress for valuation confidence |

#### 7.3 Form Components

| Component             | Description                          |
| --------------------- | ------------------------------------ |
| `PhoneInput`          | Phone input with country code prefix |
| `OTPInput`            | Individual digit inputs for OTP      |
| `AddressForm`         | Address, City, State, Pincode group  |
| `PropertyDetailsForm` | Area, Bedrooms, Bathrooms group      |

#### 7.4 Providers (COPY from valuer dashboard)

- `QueryProvider.tsx`, `ToastProvider.tsx`, `WebSocketProvider.tsx`

#### 7.5 Verification Checkpoint

```bash
npx tsc --noEmit
git add -A && git commit -m "Phase 7: Component library"
```

---

### Phase 8: Mobile Decommission (~1 hour)

> **Agent prompt hint:** "This phase is DELETION only. Do NOT create any new files. Delete the mobile app directory and remove mobile references from CI/CD and docs."

#### 8.1 Delete App Code

- `rm -rf frontend/apps/customer-app/`

#### 8.2 Remove Mobile CI/CD Jobs

- `.github/workflows/ci.yml` → remove `mobile` job
- `.github/workflows/deploy.yml` → remove `build-mobile` job
- `.github/workflows/deploy-local.yml` → remove `build-mobile-local` job

#### 8.3 Update Scripts & Config

- `turbo.json` → remove `prebuild` pipeline if unused
- `scripts/dev-start.sh` → replace customer app env with portal env

#### 8.4 Update Docs

- `README.md`, `SETUP-GUIDE.md`, `agent-onboarding.md` — replace mobile references with web

#### 8.5 Clean Dependencies

- `pnpm install` to clean lockfile

#### 8.6 Mandatory Cleanup Checklist

- [ ] Delete `frontend/apps/customer-app/` entirely
- [ ] Remove mobile CI job from `.github/workflows/ci.yml`
- [ ] Remove mobile deploy job from `.github/workflows/deploy.yml`
- [ ] Remove local mobile build job from `.github/workflows/deploy-local.yml`
- [ ] Update `turbo.json` to remove `prebuild` if unused
- [ ] Update `scripts/dev-start.sh` for customer portal env
- [ ] Update docs references from mobile to web
- [ ] Run `pnpm install` to clean lockfile

#### 8.7 Verification Checkpoint

```bash
grep -R "customer-app" .github/workflows scripts README.md SETUP-GUIDE.md || echo "✅ clean"
grep -R "expo\|react-native\|eas\|run:android\|run:ios" frontend apps scripts .github || echo "✅ clean"
test ! -d frontend/apps/customer-app && echo "✅ customer-app removed"
pnpm lint && pnpm type-check && pnpm build
git add -A && git commit -m "Phase 8: Decommission mobile app"
```

**Deliverable:** No iOS/Android build path remains in codebase or CI/CD.

> **Note:** Retain `customer-app/src/` temporarily during migration for reference. Delete in this phase only after web implementation is verified.

---

### Phase 9: Polish & Responsive Design (~1 hour)

> **Agent prompt hint:** "Focus on CSS responsive breakpoints and framer-motion animations. Do NOT restructure components — only add responsive styles and micro-interactions."

#### 9.1 Responsive Breakpoints

- **Mobile:** < 768px — single column, sidebar collapsed
- **Tablet:** 768px – 1024px — two columns, sidebar overlay
- **Desktop:** > 1024px — multi-column, persistent sidebar

#### 9.2 Animations & Micro-interactions

- Page transitions (framer-motion fade + slide)
- Button hover/tap (whileHover, whileTap with scale)
- Card hover lift shadow, loading skeletons, toast slide-in/out
- Confetti on submission

#### 9.3 SEO & Meta

- Per-page titles, meta descriptions, Open Graph tags
- `robots.txt`, `sitemap.xml`, favicon, PWA manifest

#### 9.4 Accessibility

- ARIA labels, keyboard navigation, visible focus states
- Semantic HTML5, screen reader support

#### 9.5 Verification Checkpoint

```bash
npx tsc --noEmit
pnpm dev  # test at 375px, 768px, 1280px viewport widths
git add -A && git commit -m "Phase 9: Polish and responsive"
```

---

### Phase 10: Testing & Quality (~2 hours)

> **Agent prompt hint:** "Copy test config from valuer-dashboard. Write tests for critical paths only: auth store, property store, login flow, wizard submission."

#### 10.1 Unit Tests (Vitest)

- Component tests, store tests (auth, property), API client tests

#### 10.2 E2E Tests (Playwright)

- Login flow, full wizard submission, status checking, history viewing

#### 10.3 Acceptance Test Matrix

| Area         | Test                        | Expected Outcome                                 |
| ------------ | --------------------------- | ------------------------------------------------ |
| Auth         | phone entry + login         | user lands on protected route with valid session |
| Wizard       | end-to-end submission       | property created and reaches submitted state     |
| Drafts       | refresh/reopen mid-flow     | draft restored from localStorage                 |
| Photos       | upload + remove + re-upload | final payload contains intended images only      |
| Location     | geolocation denied          | manual pin/address entry still works             |
| Status       | websocket update event      | status UI updates without reload                 |
| Responsive   | mobile/tablet/desktop       | no blocking layout regressions                   |
| Decommission | CI workflow run             | no job tries to build Android/iOS                |

#### 10.4 Monorepo Checks

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build  # both customer-portal AND valuer-dashboard must build
```

#### 10.5 Verification Checkpoint

```bash
git add -A && git commit -m "Phase 10: Tests and quality gates"
```

**Deliverable:** Green CI with customer website replacing mobile app.

---

### Phase 11: Release & Rollout

1. Deploy customer portal in staging
2. Run UAT with Route-by-Route Acceptance Criteria (below)
3. Cut production release
4. Rollback plan: tag last stable commit before merge

**Deliverable:** Production-ready customer website with mobile stack retired.

---

## File Structure (New App)

```
frontend/apps/customer-portal/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                    # My Properties (home)
│   ├── login/page.tsx
│   ├── new/
│   │   ├── page.tsx                # Property Type
│   │   ├── details/page.tsx        # Property Details
│   │   ├── location/page.tsx       # Location + Map
│   │   ├── photos/page.tsx         # Photo Upload
│   │   └── review/page.tsx         # Review & Submit
│   ├── property/[id]/
│   │   ├── page.tsx                # Status
│   │   ├── result/page.tsx         # Valuation Result
│   │   └── follow-up/page.tsx      # Follow-up
│   ├── help/page.tsx
│   └── api/proxy/[...path]/route.ts
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   └── property.ts
│   ├── components/
│   │   ├── ClientLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── Stepper.tsx
│   │   ├── FileUpload.tsx
│   │   ├── PhotoGrid.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── StatusTimeline.tsx
│   │   ├── ConfidenceMeter.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── MapView.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── PageTransition.tsx
│   ├── forms/
│   │   ├── PhoneInput.tsx
│   │   ├── OTPInput.tsx
│   │   ├── AddressForm.tsx
│   │   └── PropertyDetailsForm.tsx
│   ├── hooks/
│   │   ├── useMediaQuery.ts
│   │   └── useGeolocation.ts
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   ├── ToastProvider.tsx
│   │   └── WebSocketProvider.tsx
│   ├── services/analytics.ts
│   └── store/
│       ├── useAuthStore.ts
│       └── usePropertyStore.ts
├── public/
├── .env.example
├── Dockerfile
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## Time Estimates & Sprint Breakdown

| Phase     | Description                                   | Est. Time   |
| --------- | --------------------------------------------- | ----------- |
| **1**     | Scaffolding + copy shared code                | 1 hr        |
| **2**     | Core layout (ClientLayout, Sidebar, TopBar)   | 2 hrs       |
| **3**     | Authentication (login, auth store, guards)    | 1.5 hrs     |
| **4**     | Multi-step valuation flow (5 pages + stepper) | 4 hrs       |
| **5**     | Property status & results                     | 2.5 hrs     |
| **6**     | API & services layer                          | 1 hr        |
| **7**     | Component library                             | 1 hr        |
| **8**     | Mobile decommission                           | 1 hr        |
| **9**     | Polish, responsive, animations, a11y          | 1 hr        |
| **10**    | Testing & quality                             | 2 hrs       |
| **11**    | Release & rollout                             | 1 hr        |
| **Total** |                                               | **~18 hrs** |

| Sprint       | Phases | Focus                               |
| ------------ | ------ | ----------------------------------- |
| **Sprint 1** | 1–3    | Scaffold + layout + auth            |
| **Sprint 2** | 4–5    | Wizard + status/results             |
| **Sprint 3** | 6–9    | API + components + cleanup + polish |
| **Sprint 4** | 10–11  | Testing + release                   |

---

## Key Style Patterns (from Valuer Dashboard)

### Layout Pattern

```
Dark gradient background → Sidebar (glass.dark) → Content card (rounded, white, elevated)
```

### Color Usage

- **Primary actions:** `linear-gradient(135deg, primary[500], primary[600])` with `shadow.brand`
- **Text:** gray[900] heading → gray[700] body → gray[500] muted
- **Borders:** `colors.border` (#E5E7EB)
- **Focus:** `primary[500]` border + `primary[100]` glow

### Component Styling Pattern

```typescript
const cardStyle: React.CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: borderRadius.xl,
  boxShadow: shadow.md,
  padding: spacing[6],
};
```

### Animation Pattern

- Page transitions: framer-motion fade + slide
- Buttons: `whileHover`, `whileTap` with scale
- Sidebar: spring-based slide-in/out
- Loading: skeleton placeholders with shimmer

---

## Things NOT to Carry Over from React Native

| Feature                        | Web Replacement               |
| ------------------------------ | ----------------------------- |
| `expo-camera`                  | `<input type="file" capture>` |
| `expo-location`                | `navigator.geolocation`       |
| `expo-haptics`                 | CSS animations                |
| `react-native-maps`            | `react-leaflet`               |
| `expo-secure-store`            | `localStorage`                |
| `AsyncStorage`                 | `localStorage`                |
| Offline queue                  | Not needed for web MVP        |
| `react-native-reanimated`      | `framer-motion`               |
| `react-native-gesture-handler` | Native web events             |
| `@react-navigation`            | Next.js App Router            |
| `SafeAreaView`                 | CSS padding                   |

---

## Migration Inventory Checklist

### Mobile-only items to remove

- Expo config (`app.json`, `eas.json`, `babel.config.js`)
- Native dirs (`ios/`, `android/`)
- RN/Expo dependencies
- CI/deploy jobs for Android/EAS

### Web replacements

- `react-navigation` → Next.js App Router
- `react-native-maps` → `react-leaflet`
- `expo-location` → browser geolocation
- `expo-camera` → file input + capture + drag/drop
- secure/async storage → localStorage
- haptics → framer-motion

---

## Risk Mitigation

| Risk                                 | Mitigation                                                           |
| ------------------------------------ | -------------------------------------------------------------------- |
| Auth mismatch (OTP vs web)           | Finalize auth mode before implementation                             |
| Camera/location browser differences  | Support both capture and manual upload; graceful fallback            |
| Style drift from valuer dashboard    | Copy files first, then customize labels only                         |
| CI breakage from mobile removal      | Remove all references in one PR, run full pipeline                   |
| Large image upload timeouts          | Client-side compression + progress + retry + size limits             |
| Geolocation permission fragmentation | Graceful fallback to manual coordinates                              |
| Session timeout during wizard        | Token refresh + auto-save drafts + "Save & Continue Later"           |
| Draft recovery on refresh            | localStorage persistence + hydration guard                           |
| **Agent rewrites entire files**      | **GEMINI.md says "focused edits only"; plan says "copy then adapt"** |
| **Agent duplicates existing code**   | **Plan requires checking @propflow/\* before creating components**   |
| **Agent loses context mid-phase**    | **Plan splits Phase 4 into sub-sessions; one phase per session**     |

---

## NFR Quality Gates

1. **Performance** — Avoid heavy client bundles; image uploads resilient for low-bandwidth
2. **Accessibility** — Keyboard-accessible forms, ARIA labels, visible focus, screen reader
3. **Security** — No token leakage in logs; consistent auth token handling
4. **Reliability** — Draft recovery after refresh; WebSocket reconnect doesn't break status

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

## Route-by-Route Acceptance Criteria

| Route                      | Source Screen(s)           | Must-Have Acceptance                               |
| -------------------------- | -------------------------- | -------------------------------------------------- |
| `/login`                   | WelcomeScreen + OTPScreen  | auth persists session, redirects to protected area |
| `/new`                     | PropertyTypeScreen         | selection persists and advances correctly          |
| `/new/details`             | PropertyDetailsScreen      | validation parity, save/continue works             |
| `/new/location`            | LocationScreen             | geolocation + manual fallback + draggable marker   |
| `/new/photos`              | PhotoCapture + PhotoReview | upload/remove/review on mobile and desktop         |
| `/new/review`              | SubmitScreen               | summary correct, edit links, submit success        |
| `/`                        | dashboard listing          | list loads, filters work, empty state              |
| `/property/[id]`           | StatusScreen               | timeline + websocket status refresh                |
| `/property/[id]/result`    | ValuationResultScreen      | value, confidence, comparables render              |
| `/property/[id]/follow-up` | FollowUpScreen             | upload/edit/submit follow-up works                 |

---

## Release Evidence Checklist

- [ ] Screenshots/video for: login, each wizard step, property detail, result, follow-up
- [ ] Output of monorepo checks: lint, type-check, test, build
- [ ] Confirmation that all 3 workflow files no longer contain mobile jobs
- [ ] Confirmation that `frontend/apps/customer-app/` is deleted
- [ ] Short rollback note with commit/tag to revert to if needed

---

## Decommission Verification Commands

```bash
grep -R "customer-app" .github/workflows scripts README.md SETUP-GUIDE.md || true
grep -R "expo\|react-native\|eas\|run:android\|run:ios" frontend apps scripts .github || true
test ! -d frontend/apps/customer-app && echo "✅ customer-app removed"
pnpm lint && pnpm type-check && pnpm test && pnpm build
```

---

## Definition of Done

1. ✅ Customer journey works fully on web (login → submit → track → result/follow-up)
2. ✅ UI matches valuer dashboard frontend style
3. ✅ `frontend/apps/customer-app/` no longer exists
4. ✅ No CI/CD references to iOS/Android/Expo/EAS
5. ✅ Docs mention customer website, not mobile app
6. ✅ Monorepo lint/type-check/test/build pass
7. ✅ Responsive on mobile, tablet, desktop
8. ✅ E2E tests pass for critical journey
9. ✅ Customer web app runs on `localhost:3001`
10. ✅ Route-by-route UAT acceptance signed off

---

## Open Decisions to Close This Week

1. Auth UX: OTP-only vs password+OTP hybrid
2. Profile/history: MVP or post-MVP
3. PWA installability: required at launch or deferred
4. Analytics: part of MVP or not
5. Rollout: phased (feature flag) or direct replacement

---

## Immediate Next Actions

1. Create `GEMINI.md` in project root (contents in this plan)
2. Approve app name (`customer-portal`) and auth mode
3. Start Phase 1 scaffolding from valuer-dashboard baseline
4. Decommission mobile only after web is functionally complete in staging

---

## Notes

- The **customer portal** and **valuer dashboard** share the same backend API but serve different roles
- Auth tokens are role-based — customer login returns a `CUSTOMER` role user
- Both apps runnable simultaneously (3000 for valuer, 3001 for customer)
- `@propflow/theme` ensures visual consistency across both apps
- Consider API proxy in `next.config.js` for CORS (same as valuer dashboard)
