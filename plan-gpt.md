# Customer App -> Website Migration Plan (Valuer Dashboard Style)

## 0) Improvements Incorporated in This Version

This revision strengthens the plan with:

- Explicit **architecture decision matrix** (so tradeoffs are locked early).
- Clear **React Native -> Next.js file mapping** for every migrated screen.
- A **decision-gates section** to close key unknowns before implementation.
- More concrete **mobile decommission checklist** (code + CI/CD + scripts + docs).
- Added **acceptance test matrix**, **NFR quality gates**, and **env contract**.
- Added **navigation IA contract** (sidebar routes and titles) to avoid route drift.
- Added **route-by-route acceptance criteria** for faster QA/UAT signoff.
- Added **release evidence checklist + decommission verification commands**.

## 1) Goal and Scope

Convert the current customer experience from a React Native Expo app into a Next.js website that follows the same frontend style, component patterns, and interaction model as the valuer dashboard.

At the same time, fully decommission iOS and Android app support from this monorepo.

### In scope

- Build a new customer web app in the frontend apps workspace.
- Reuse visual language and architecture from valuer dashboard.
- Migrate customer flow screens to web routes/components.
- Remove mobile app code and mobile CI/CD/build references.

### Out of scope

- Backend API redesign.
- New product features outside the existing customer journey.
- Native app maintenance (iOS/Android intentionally removed).

---

## 2) Baseline (Current State)

### Existing frontend apps

- `frontend/apps/customer-app` was React Native + Expo (Removed).
- `frontend/apps/valuer-dashboard` is Next.js App Router and already defines the target style baseline.

### Why this migration is straightforward

- Shared packages already exist for theme/types/ui/utils:
  - `@propflow/theme`
  - `@propflow/types`
  - `@propflow/ui`
  - `@propflow/utils`
- So style and data models can be reused directly.

### Evidence from repository

- Customer app (Removed):
  - `frontend/apps/customer-app/package.json` (scripts include `android`, `ios`, `prebuild`)
  - `frontend/apps/customer-app/app.json` (has `ios` and `android` blocks)
  - `frontend/apps/customer-app/eas.json` (mobile build profiles)
- Valuer dashboard style and architecture baseline:
  - `frontend/apps/valuer-dashboard/app/layout.tsx`
  - `frontend/apps/valuer-dashboard/src/components/ClientLayout.tsx`
  - `frontend/apps/valuer-dashboard/src/components/Sidebar.tsx`
  - `frontend/apps/valuer-dashboard/src/components/TopBar.tsx`
  - `frontend/apps/valuer-dashboard/app/globals.css`

---

## 3) Target Architecture

## 3.1 New app location

Create a new web app:

`frontend/apps/customer-portal`

(using Next.js App Router, aligned with valuer dashboard patterns)

## 3.2 Route model (mapping from mobile navigation)

Map existing mobile screens to web routes:

- Auth
  - `WelcomeScreen` + `OTPScreen` -> `/login` (OTP-first or phone/password + OTP fallback)
- Main flow
  - `PropertyTypeScreen` -> `/new`
  - `PropertyDetailsScreen` -> `/new/details`
  - `LocationScreen` -> `/new/location`
  - `PhotoCaptureScreen` + `PhotoReviewScreen` -> `/new/photos`
  - `SubmitScreen` -> `/new/review`
  - `StatusScreen` -> `/property/[id]`
  - `ValuationResultScreen` -> `/property/[id]/result`
  - `FollowUpScreen` -> `/property/[id]/follow-up`

## 3.3 Visual style parity requirements

Customer web must match valuer dashboard style language:

- Dark gradient outer canvas.
- Glassmorphism sidebar/topbar.
- Rounded elevated main content surface.
- Same token-based spacing, typography, and color usage.
- Same motion style using `framer-motion`.
- Same status badge/card patterns.

## 3.4 Architecture decision matrix (must lock before build)

| Decision area     | Chosen default                                     | Why this is preferred                                  |
| ----------------- | -------------------------------------------------- | ------------------------------------------------------ |
| Framework         | Next.js 16 (App Router)                            | Matches valuer dashboard architecture exactly          |
| Styling           | Inline styles + `@propflow/theme` tokens           | Maximum visual parity with valuer dashboard            |
| Animations        | `framer-motion`                                    | Already used in valuer dashboard                       |
| Icons             | `lucide-react`                                     | Shared icon language with valuer dashboard             |
| Maps              | `react-leaflet`                                    | Already present in dashboard stack                     |
| Location          | Browser Geolocation API                            | Web-native replacement for `expo-location`             |
| Photos            | File input + drag/drop (+ optional camera capture) | Web-native replacement for `expo-camera`               |
| State             | Zustand + localStorage persistence                 | Aligns with dashboard and web expectations             |
| Data fetching     | React Query + Axios                                | Existing project pattern                               |
| Auth              | Phone + Password (primary) + OTP fallback          | Aligns with existing backend while preserving OTP path |
| Customer app port | `3001` (recommended)                               | Avoids collision with valuer dashboard at `3000`       |

## 3.5 RN -> Web screen/file mapping (migration contract)

| React Native source                          | Website target                         |
| -------------------------------------------- | -------------------------------------- |
| `App.tsx`                                    | `app/layout.tsx`                       |
| `src/navigation/AppNavigator.tsx`            | App Router route structure             |
| `src/screens/auth/WelcomeScreen.tsx`         | `app/login/page.tsx` (step 1)          |
| `src/screens/auth/OTPScreen.tsx`             | `app/login/page.tsx` (step 2)          |
| `src/screens/main/PropertyTypeScreen.tsx`    | `app/new/page.tsx`                     |
| `src/screens/main/PropertyDetailsScreen.tsx` | `app/new/details/page.tsx`             |
| `src/screens/main/LocationScreen.tsx`        | `app/new/location/page.tsx`            |
| `src/screens/main/PhotoCaptureScreen.tsx`    | `app/new/photos/page.tsx`              |
| `src/screens/main/PhotoReviewScreen.tsx`     | `app/new/photos/page.tsx`              |
| `src/screens/main/SubmitScreen.tsx`          | `app/new/review/page.tsx`              |
| `src/screens/main/StatusScreen.tsx`          | `app/property/[id]/page.tsx`           |
| `src/screens/main/ValuationResultScreen.tsx` | `app/property/[id]/result/page.tsx`    |
| `src/screens/main/FollowUpScreen.tsx`        | `app/property/[id]/follow-up/page.tsx` |

## 3.6 Pre-implementation decision gates

Close these decisions before writing production code:

1. **Auth mode**: OTP-first vs phone+password-first (with OTP fallback).
2. **Photo acquisition strategy**: upload-only vs upload + web camera capture.
3. **Map behavior**: Leaflet only vs adding third-party geocoding/autocomplete provider.
4. **PWA scope**: installable app behavior needed at launch or deferred.
5. **Analytics**: launch with tracking baseline or add post-MVP.
6. **Cutover strategy**: big-bang switch vs staged rollout with feature flag.

## 3.7 Navigation IA contract (customer portal)

Primary sidebar navigation should be fixed early and reused across layout/tests/docs:

| Label                            | Route            | Notes                                   |
| -------------------------------- | ---------------- | --------------------------------------- |
| New Valuation                    | `/new`           | Starts wizard flow                      |
| My Properties                    | `/`              | Default landing for authenticated users |
| Track Status                     | `/property/[id]` | Usually reached from property list card |
| Help & Support (optional in MVP) | `/help`          | Include only if MVP scope approves      |

Topbar should map titles by route group to avoid inconsistent page headers.

---

## 4) Detailed Execution Plan

## Phase A - Planning, freeze, and branch setup

1. Create migration branch (example: `feat/customer-web-migration`).
2. Freeze net-new feature changes in `customer-app` during migration window.
3. Confirm auth mode for customer website:
   - Option A: keep OTP flow (closest parity with existing customer app).
   - Option B: align with valuer phone+password login and keep OTP as fallback.
4. Decide final app package name:
   - Recommended: `@propflow/customer-portal`.

Deliverable:

- Approved migration decisions and branch created.

## Phase B - Scaffold customer web app

1. Create `frontend/apps/customer-portal`.
2. Bootstrap with Next.js App Router structure.
3. Copy and adapt baseline configs from valuer dashboard:
   - `next.config.js`
   - `tsconfig.json`
   - lint setup
   - env template
4. Add dependencies similar to valuer dashboard + customer needs:
   - `next`, `react`, `react-dom`
   - `@tanstack/react-query`
   - `zustand`
   - `axios`
   - `framer-motion`
   - `lucide-react`
   - `leaflet`, `react-leaflet`, `@types/leaflet`
   - shared packages (`@propflow/theme`, etc.)

Deliverable:

- `customer-portal` runs locally with placeholder route.

## Phase C - Core shell and style parity

1. Build `app/layout.tsx` for customer portal (same provider stack style as valuer):
   - Query provider
   - Toast provider
   - WebSocket provider
   - Error boundary
2. Implement `ClientLayout`, `Sidebar`, `TopBar` using valuer patterns, with customer nav labels.
3. Add global CSS animations/transitions consistent with dashboard behavior.
4. Add route title mapping in topbar for customer pages.

Deliverable:

- Navigable shell that visually matches valuer dashboard.

## Phase D - Auth and session management

1. Build customer auth store (`zustand` persist with browser storage).
2. Implement login page and validation/error states.
3. Wire auth guard into layout (avoid flash on initial hydration).
4. Confirm role handling (`CUSTOMER`) and token persistence.

Deliverable:

- End-to-end login/logout flow working on web.

## Phase E - Multi-step new valuation wizard

1. Build shared stepper/progress component.
2. Implement step routes and form state persistence:
   - `/new`
   - `/new/details`
   - `/new/location`
   - `/new/photos`
   - `/new/review`
3. Replace native capabilities with web-native equivalents:
   - Location: `navigator.geolocation` + Leaflet map + draggable marker.
   - Photos: `<input type="file" accept="image/*" capture="environment">` + drag/drop for desktop.
   - Upload hardening: enforce file type/size limits, client-side compression, retry/backoff for slow networks.
4. Add validation parity with current mobile form logic.
5. Save draft state in local storage to prevent data loss.

Deliverable:

- Customer can complete and submit valuation request entirely on web.

## Phase F - Status tracking and result pages

1. Build home page listing customer properties and statuses.
2. Build property detail status timeline page.
3. Build valuation result page and follow-up page.
4. Add websocket invalidation/update behavior for status refresh.

Deliverable:

- Full post-submission customer journey available on web.

## Phase G - Mobile decommission (remove iOS/Android app)

This phase removes native app code and all references.

1. Remove app code:
   - Delete `frontend/apps/customer-app/` (includes iOS/Android directories and Expo configs).
2. Remove mobile pipeline tasks:
   - `.github/workflows/ci.yml`: remove `mobile` job.
   - `.github/workflows/deploy.yml`: remove `build-mobile` job.
   - `.github/workflows/deploy-local.yml`: remove `build-mobile-local` job.
3. Remove mobile-specific scripts/pipeline config:
   - `turbo.json`: remove `prebuild` pipeline stage if no longer used.
   - `scripts/dev-start.sh`: replace customer app env setup with customer portal env setup.
4. Update docs and onboarding:
   - `README.md`
   - setup guides
   - any docs referencing Expo/iOS/Android.
5. Clean lockfile and dependencies:
   - run install to remove Expo/native packages from lockfile.

### Mandatory cleanup checklist (exact files/systems)

- Delete app path: `frontend/apps/customer-app/`.
- Remove mobile CI job from: `.github/workflows/ci.yml` (`mobile` job).
- Remove mobile deploy job from: `.github/workflows/deploy.yml` (`build-mobile` job).
- Remove local mobile build job from: `.github/workflows/deploy-local.yml` (`build-mobile-local` job).
- Update local bootstrap script: `scripts/dev-start.sh` to use customer web app env setup.
- Update docs references from mobile to web:
  - `README.md`
  - `SETUP-GUIDE.md`
  - onboarding docs that mention Expo/Android/iOS.
- Ensure no remaining references to `expo`, `react-native`, `eas`, `run:android`, `run:ios` in active app/workflow paths.

Deliverable:

- No iOS/Android build path remains in codebase or CI/CD.

## Phase H - Testing and quality gates

1. Unit tests for critical stores/components.
2. Integration tests for:
   - login flow
   - wizard validation + submit
   - status page rendering
3. E2E smoke for customer portal primary journey.
4. Run monorepo checks:
   - lint
   - type-check
   - test
   - build (customer portal + valuer dashboard)

### Acceptance test matrix (minimum)

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

### Release evidence checklist (attach to PR/hand-off)

- Screenshots/video for: login, each wizard step, property detail, result, follow-up.
- Output of monorepo checks: lint, type-check, test, build.
- Confirmation that all 3 workflow files no longer contain mobile jobs.
- Confirmation that `frontend/apps/customer-app/` is deleted.
- Short rollback note with commit/tag to revert to if needed.

Deliverable:

- Green CI with customer website replacing mobile app.

## Phase I - Release and rollout

1. Deploy customer portal in staging.
2. Run UAT with product/ops.
3. Cut production release.
4. Keep rollback plan:
   - Revert to last stable commit if customer portal regression is critical.

Deliverable:

- Production-ready customer website with mobile stack retired.

## 4A) Route-by-route acceptance contract

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

## 5) Migration Inventory Checklist

## 5.1 Mobile-only items to remove

- Expo config and build files (`app.json`, `eas.json`, `babel.config.js` in customer app).
- Native directories (`ios/`, `android/` under customer app).
- React Native / Expo dependencies in customer app package.
- CI and deploy jobs that run Android or EAS builds.

## 5.2 Web replacements

- `react-navigation` -> Next.js App Router.
- `react-native-maps` -> `react-leaflet`.
- `expo-location` -> browser geolocation.
- `expo-camera` -> file input + capture + drag/drop.
- secure/async storage -> browser local storage patterns.
- haptics -> web motion/interaction feedback.

---

## 6) Risks and Mitigations

1. Auth mismatch between existing OTP flow and web expectations

- Mitigation: finalize auth mode before implementation, keep OTP fallback path.

2. Camera/location behavior differences across browsers

- Mitigation: support both direct capture and manual upload; graceful fallback for denied geolocation.

3. Style drift from valuer dashboard

- Mitigation: build from copied layout/component primitives first, then customize labels/content only.

4. CI breakage from mobile job removal

- Mitigation: remove references in all workflow files in one PR and run full pipeline.

5. Large image uploads causing timeouts/poor UX

- Mitigation: client-side compression + upload progress + retry + explicit size limits.

6. Geolocation/browser permission fragmentation

- Mitigation: graceful fallback to manual coordinates/address, clear permission messaging.

---

## 6.1 Environment and configuration contract

```env
# customer-portal .env.example
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_APP_NAME=PropFlow Customer Portal
NEXT_PUBLIC_APP_PORT=3001
```

Notes:

- Keep API/WS variables aligned with backend and valuer-dashboard conventions.
- Run customer portal on a non-conflicting local port (recommended `3001`).

---

## 6.2 Non-functional quality gates (NFRs)

1. **Performance**
   - Initial route should avoid heavy client bundles and unnecessary blocking requests.
   - Image upload path should be resilient for low-bandwidth users.
2. **Accessibility**
   - Keyboard-accessible forms and controls.
   - Visible focus states and semantic labels for all core actions.
3. **Security**
   - No token leakage in logs.
   - Auth tokens stored and handled consistently with existing app policies.
4. **Reliability**
   - Draft recovery works after refresh/tab close.
   - Websocket disconnect/reconnect does not break status tracking.

---

## 7) Definition of Done

The migration is complete when all are true:

1. Customer journey works fully on web (login -> new valuation -> submit -> track -> result/follow-up).
2. UI clearly matches valuer dashboard frontend style.
3. `frontend/apps/customer-app` no longer exists.
4. No CI/CD workflow references iOS/Android/Expo/EAS builds.
5. Docs and local setup instructions mention customer website, not mobile app.
6. Monorepo lint/type-check/test/build pass.
7. Route-by-route UAT contract (`4A`) is signed off.
8. Critical E2E tests pass for auth + wizard + status journey.
9. Responsive behavior is verified on mobile/tablet/desktop breakpoints.
10. Customer portal runs locally on configured non-conflicting port (recommended `3001`).

---

## 8) Suggested Delivery Breakdown (Execution Sprints)

- Sprint 1: Phases A-C (scaffold + style shell)
- Sprint 2: Phases D-E (auth + valuation wizard)
- Sprint 3: Phases F-H (status/results + cleanup + tests)
- Sprint 4: Phase I (staging UAT and production release)

---

## 9) Immediate Next Actions

1. Approve app name (`customer-portal`) and auth mode.
2. Start Phase B scaffolding from valuer-dashboard baseline.
3. After customer portal shell is running, begin screen-by-screen migration from current customer app.
4. Perform mobile decommission only after the web replacement is functionally complete in staging.

---

## 10) Open decisions to close this week

1. Confirm auth UX: OTP-only vs password+OTP hybrid.
2. Confirm whether customer web includes profile/history in MVP or post-MVP.
3. Confirm whether PWA installability is required at initial release.
4. Confirm whether analytics and event taxonomy are part of MVP.
5. Confirm whether rollout is phased (feature flag) or direct replacement.

---

## 11) Decommission verification commands (copy-paste)

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
