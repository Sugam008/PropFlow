# PropFlow Build Plan & Architecture

## 1. Tech Stack Recommendation

### Backend Stack (Python)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Runtime** | Python 3.11+ | Excellent AI/ML ecosystem, financial calculations |
| **Framework** | FastAPI | Modern, async, auto-generated OpenAPI docs, high performance |
| **Database** | PostgreSQL | Robust relational DB for property data, transactions |
| **ORM** | SQLAlchemy 2.0 + Alembic | Mature, type-safe, excellent migration support |
| **File Storage** | AWS S3 (or MinIO for self-hosted) | Scalable image/GPS storage |
| **Real-time** | Socket.io | Live status updates between customer app and valuer dashboard |
| **Image Processing** | Pillow + piexif | EXIF extraction for GPS/timestamp verification |
| **AI/ML** | Google Cloud Vision API | Image QC (blur detection, labels) - as researched |
| **Authentication** | JWT + Redis (session) | Secure, scalable auth |
| **Validation** | Pydantic v2 | Type-safe schema validation, built into FastAPI |
| **API Docs** | Swagger/OpenAPI (auto-generated) | Built into FastAPI |
| **Task Queue** | Celery + Redis | Background jobs (image processing, notifications) |
| **Maps** | Mapbox or Leaflet (OpenStreetMap) | GPS visualization |
| **Notifications** | Twilio (SMS) + WhatsApp Business API | India-critical for status updates |
| **Testing** | Pytest + pytest-asyncio | Comprehensive testing support |

### Frontend Stack (React)

| App | Technology | Rationale |
|-----|------------|-----------|
| **Customer Mobile App** | React Native (Expo) | Cross-platform, single codebase with React |
| **Valuer Dashboard** | Next.js 14 (App Router) | React-based, SSR, excellent performance |
| **UI Framework** | Tailwind CSS + Custom Design System | Full control, matches Aditya Birla branding |
| **State Management** | Zustand (mobile) + React Query (web) | Lightweight, caching built-in |
| **Maps** | react-native-maps (mobile) + Mapbox GL (web) | Native + web mapping |
| **Forms** | React Hook Form + Zod | Performance + validation |
| **Charts** | Recharts | Comps dashboard visualization |
| **Icons** | Lucide React | Clean, consistent icons |

---

## 1B. Design System Specifications

### Brand Colors (Aditya Birla Capital)

```typescript
// frontend/packages/ui/src/theme/colors.ts
export const colors = {
  // Primary - Aditya Birla Red
  primary: {
    main: '#E31E24',      // ABC Red - Primary CTAs, brand moments
    light: '#FF4D52',
    dark: '#B81B20',      // Hover states
    maroon: '#8B0000',    // Deep accents
    contrast: '#FFFFFF',
  },
  
  // Neutral Palette
  neutral: {
    white: '#FFFFFF',
    offWhite: '#FAFAFA',
    cream: '#FFF8F8',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Semantic Colors
  semantic: {
    success: '#059669',
    successLight: '#D1FAE5',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    error: '#DC2626',
    errorLight: '#FEE2E2',
    info: '#2563EB',
    infoLight: '#DBEAFE',
    purple: '#7C3AED',
    purpleLight: '#EDE9FE',
  },
};
```

### Typography System

```typescript
// Typography tokens (from ui.md)
export const typography = {
  // Font stack
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'SF Mono', 'Roboto Mono', monospace",
  },
  
  // Type scale
  fontSize: {
    display1: { mobile: 36, tablet: 42, desktop: 48 },    // Hero headlines
    display2: { mobile: 30, tablet: 36, desktop: 42 },     // Page titles
    heading1: { mobile: 28, tablet: 32, desktop: 36 },      // Section headers
    heading2: { mobile: 24, tablet: 26, desktop: 28 },      // Subsections
    heading3: { mobile: 20, tablet: 22, desktop: 24 },      // Card titles
    heading4: { mobile: 18, tablet: 19, desktop: 20 },      // Small headings
    bodyLarge: 18,
    body: 16,                                              // Prevents iOS zoom
    bodySmall: 14,
    caption: 12,
    overline: 11,
    button: 16,
    label: 14,
  },
  
  // Weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};
```

### Spacing System (4px Base)

```typescript
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};
```

### Component Specifications

#### Primary Button
- Height: 48px (mobile), 52px (tablet), 56px (desktop)
- Border-radius: 12px
- Background: #E31E24
- Hover: #B81B20, translateY(-1px)
- Disabled: #9CA3AF, opacity 0.6

#### Input Fields
- Height: 52px (mobile), 56px (desktop)
- Border-radius: 12px
- Font-size: 16px (prevents iOS zoom)
- Focus: Border #E31E24, shadow 0 0 0 3px rgba(227,30,36,0.1)

#### Cards
- Border-radius: 16px
- Padding: 16px (mobile), 24px (desktop)
- Shadow: 0 1px 3px rgba(0,0,0,0.08)

---

## 1C. Responsive Breakpoints

| Breakpoint | Width | Primary Users |
|------------|-------|--------------|
| xs | 320-479px | Budget phones |
| sm | 480-767px | Mid-range phones |
| md | 768-1023px | Tablets portrait |
| lg | 1024-1279px | Tablets landscape, laptops |
| xl | 1280-1535px | Desktop |
| 2xl | 1536px+ | Large monitors |

### Layout Strategy

- **Mobile (85% users)**: Single column, stacked, bottom navigation
- **Tablet**: Adaptive split when landscape
- **Desktop**: Multi-panel workspace for valuers

---

## 1D. UX Guidelines (from ux.md)

### Core UX Beliefs
1. User is not broken - design is if they struggle
2. Time is the scarcest resource
3. Anxiety is the enemy - reduce financial anxiety
4. Trust must be earned - every interaction builds or erodes it
5. Simplicity requires complexity (to make it simple)

### Customer Journey (Max 4 Screens)

```
1. Welcome/OTP     →  2. Property Type    →  3. Property Details  →  4. Photos/Submit
   (Auth)                (Selection)            (Form)                  (Capture)
```

### Feedback Timing

| Response Time | Feedback Type |
|---------------|---------------|
| 0-100ms | Button press, haptic |
| 100-300ms | Loading states |
| 300-500ms | Screen transitions |
| 500ms+ | Progress indicators |

### Emotional Journey

| Screen | Target Emotion | Design Tactic |
|--------|---------------|---------------|
| Welcome | Trust | Social proof, speed promise |
| OTP | Progress | Quick entry, minimal friction |
| Property Type | Confidence | Clear options |
| Details | Simplicity | Smart defaults |
| Location | Transparency | Visual map, explain why |
| Photos | Guidance | Overlays, audio, feedback |
| Review | Control | Retake options |
| Submit | Relief | Success animation |
| Tracking | Patience | Real-time status |

### Validation Strategy
- **Real-time**: Phone format, area numeric
- **On blur**: All text fields
- **On continue**: All required fields
- **On submit**: All data validated

---

## 1E. Screen Flow Specifications

### Customer App Screens (from user-journey.md)

| Screen | Purpose | Key Features |
|--------|---------|--------------|
| **S1: Welcome** | Trust building | Logo animation, trust badges, CTA |
| **S2: OTP** | Authentication | Auto-read OTP, 6-digit input |
| **S3: Property Type** | Selection | 4 types (Apartment/House/Plot/Commercial) |
| **S4: Property Details** | Data capture | BHK pills, area slider, age/floor dropdowns |
| **S5: Location** | GPS capture | Map, auto-detect, accuracy indicator |
| **S6: Photo Capture** | Guided capture | Overlay guides, real-time QC, audio hints |
| **S7: Review** | Quality check | Grid view, retake option, submit |
| **S8: Submit** | Confirmation | Success animation, reference number, WhatsApp share |
| **S9: Tracking** | Status | Real-time timeline, valuer name |
| **S10: Complete** | Result | Value range, comps, next steps |

### Valuer Dashboard Screens

| Screen | Purpose | Key Features |
|--------|---------|--------------|
| **V1: Queue** | Overview | Pending count, priority indicators, quick actions |
| **V2: Review** | Decision | Split-screen photos/map/comps, keyboard shortcuts |
| **V3: Follow-up** | Request info | Template messaging, photo-specific feedback |

### Keyboard Shortcuts (Valuer)

| Key | Action |
|-----|--------|
| J/K | Navigate queue |
| Enter | Open property |
| ←/→ | Navigate photos |
| A | Approve |
| R | Request follow-up |
| F | Flag |
| E | Expand photo |

---

## 1F. Photo Capture Requirements (from user-journey.md)

### Photo Types Matrix

| # | Type | Required | Guidance | Why |
|---|------|----------|----------|-----|
| 1 | Building Exterior | ✓ | "Show full building, include entrance" | Location verification |
| 2 | Living Room | ✓ | "Stand in corner, include window" | Space assessment |
| 3 | Kitchen | ✓ | "Show counter, appliances" | Condition check |
| 4 | Master Bedroom | ✓ | "Include built-in wardrobe" | Space verification |
| 5 | Bathroom | ✓ | "Show fittings, ventilation" | Condition score |
| 6 | Society | ○ | "Club house, parking, lift" | Premium assessment |

### Quality Thresholds

| Check | Threshold | Feedback |
|-------|-----------|----------|
| Blur | Sharpness < 30 | "Hold steady and retake" |
| Darkness | Brightness < 40 | "Turn on lights" |
| Glare | Highlight > 70% | "Angle away from light" |

### Camera Enforcement
- No gallery picker - camera intent only
- EXIF metadata auto-captured
- Timestamp verification against server time
- Screenshot detection = auto-reject

---

## 1G. Accessibility Requirements (from overall-design-principles.md)

### WCAG 2.1 AA Compliance
- Color contrast: 4.5:1 minimum
- Touch targets: 44x44px minimum
- Focus indicators on all interactive elements
- Screen reader compatible

### Device Support
- iOS 13+
- Android 7+
- Works on 2GB RAM devices
- Functions on 3G networks

---

## 1H. Notification Strategy

| Channel | Timing | Content |
|---------|--------|---------|
| SMS | Immediate | "PropFlow: Submission received. Ref: PF-XXXX" |
| WhatsApp | +5 min | Rich card with status timeline |
| Push | On status change | "Your valuation is complete!" |

---

## 1I. Success Metrics

| Metric | Target |
|--------|--------|
| Time to complete (customer) | < 8 minutes |
| Screens per session | 4-5 average |
| Help requests | < 5% of users |
| App size | < 25MB |
| Load time on 3G | < 3s |
| Crash rate | < 0.1% |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PropFlow Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐         ┌──────────────┐                     │
│   │   Customer   │         │    Valuer    │                     │
│   │  Mobile App  │         │  Dashboard   │                     │
│   │ (React Native)         │  (Next.js)   │                     │
│   └──────┬───────┘         └──────┬───────┘                     │
│          │                         │                             │
│          └──────────┬──────────────┘                             │
│                     │                                            │
│                     ▼                                            │
│          ┌─────────────────────┐                                 │
│          │     API Gateway     │                                 │
│          │    (Express.js)     │                                 │
│          └──────────┬──────────┘                                 │
│                     │                                            │
│     ┌───────────────┼───────────────┐                           │
│     │               │               │                            │
│     ▼               ▼               ▼                            │
│ ┌────────┐    ┌───────────┐   ┌──────────┐                       │
│ │ Auth   │    │ Property  │   │  Image   │                       │
│ │ Service│    │  Service  │   │ Service  │                       │
│ └────────┘    └───────────┘   └──────────┘                       │
│     │               │               │                            │
│     ▼               ▼               ▼                            │
│ ┌────────┐    ┌───────────┐   ┌──────────┐                       │
│ │ Redis  │    │PostgreSQL │   │   AWS S3 │                       │
│ │Session │    │           │   │          │                       │
│ └────────┘    └───────────┘   └──────────┘                       │
│                                                                 │
│   ┌──────────────────────────────────────────────┐             │
│   │         Background Jobs (BullMQ)             │             │
│   │  • Image QC (Google Vision)                   │             │
│   │  • SMS/WhatsApp Notifications                 │             │
│   │  • Comp Analysis                              │             │
│   └──────────────────────────────────────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Project Structure

```
propflow/
├── backend/                    # Python FastAPI server
│   ├── app/
│   │   ├── api/               # API routes (FastAPI routers)
│   │   │   ├── v1/
│   │   │   │   ├── auth/
│   │   │   │   │   └── auth.py
│   │   │   │   ├── properties/
│   │   │   │   │   ├── properties.py
│   │   │   │   │   └── photos.py
│   │   │   │   ├── valuations/
│   │   │   │   │   └── valuations.py
│   │   │   │   └── comps/
│   │   │   │       └── comps.py
│   │   │   └── deps.py         # Dependencies (auth, db)
│   │   │
│   │   ├── core/              # Core configuration
│   │   │   ├── config.py      # Settings
│   │   │   ├── security.py    # JWT, password hashing
│   │   │   └── exceptions.py  # Custom exceptions
│   │   │
│   │   ├── crud/              # CRUD operations
│   │   │   ├── base.py        # Base CRUD class
│   │   │   ├── user.py
│   │   │   ├── property.py
│   │   │   ├── photo.py
│   │   │   ├── valuation.py
│   │   │   └── comp.py
│   │   │
│   │   ├── models/            # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── property.py
│   │   │   ├── photo.py
│   │   │   ├── valuation.py
│   │   │   └── comp.py
│   │   │
│   │   ├── schemas/           # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── property.py
│   │   │   ├── photo.py
│   │   │   ├── valuation.py
│   │   │   └── comp.py
│   │   │
│   │   ├── services/          # Business logic
│   │   │   ├── image_service.py      # Image upload, EXIF
│   │   │   ├── image_qc_service.py  # Google Vision QC
│   │   │   ├── sms_service.py
│   │   │   ├── whatsapp_service.py
│   │   │   └── valuation_service.py
│   │   │
│   │   ├── tasks/             # Celery tasks
│   │   │   ├── image_processing.py
│   │   │   ├── notifications.py
│   │   │   └── valuation_calc.py
│   │   │
│   │   ├── websocket/         # Socket.io handlers
│   │   │   ├── connection.py
│   │   │   └── events.py
│   │   │
├──
│   │   │       ├── exif.util.ts
│   │   │       └── gps.util.ts
│   │   │
│   │   ├── jobs/              # BullMQ workers
│   │   │   ├── image-qc.job.ts
│   │   │   ├── notify-customer.job.ts
│   │   │   └── valuation-calc.job.ts
│   │   │
│   │   ├── websocket/         # Socket.io handlers
│   │   │   ├── events/
│   │   │   │   ├── property.events.ts
│   │   │   │   └── valuation.events.ts
│   │   │   └── websocket.gateway.ts
│   │   │
│   │   ├── routes/            # Main route aggregation
│   │   │   └── index.ts
│   │   │
│   │   ├── app.module.ts      # Main application module
│   │   └── main.ts            # Entry point
│   │
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   │
│   ├── tests/                 # Backend tests
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   ├── scripts/               # Utility scripts
│   │   ├── seed.ts            # Database seeding
│   │   └── migrate.ts         # Migration runner
│   │
│   ├── .env.example           # Environment template
│   ├── package.json
│   ├── tsconfig.json
│   ├── docker-compose.yml    # Local development
│   └── Dockerfile             # Production container
│
│
├── frontend/
│   ├── apps/
│   │   ├── customer-app/      # React Native (Expo)
│   │   │   ├── src/
│   │   │   │   ├── components/        # Reusable UI components
│   │   │   │   │   ├── common/
│   │   │   │   │   │   ├── Button.tsx
│   │   │   │   │   │   ├── Input.tsx
│   │   │   │   │   │   ├── Card.tsx
│   │   │   │   │   │   ├── Header.tsx
│   │   │   │   │   │   └── Loading.tsx
│   │   │   │   │   ├── forms/
│   │   │   │   │   │   ├── PropertyForm.tsx
│   │   │   │   │   │   └── AddressAutocomplete.tsx
│   │   │   │   │   └── camera/
│   │   │   │   │       ├── GuidedCamera.tsx
│   │   │   │   │       ├── CameraOverlay.tsx
│   │   │   │   │       └── PhotoPreview.tsx
│   │   │   │   │
│   │   │   │   ├── screens/           # Screen components
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── LoginScreen.tsx
│   │   │   │   │   │   └── OTPScreen.tsx
│   │   │   │   │   ├── property/
│   │   │   │   │   │   ├── PropertyDetailsScreen.tsx
│   │   │   │   │   │   ├── PropertyTypeScreen.tsx
│   │   │   │   │   │   └── PropertyPhotosScreen.tsx
│   │   │   │   │   ├── capture/
│   │   │   │   │   │   ├── CaptureStartScreen.tsx
│   │   │   │   │   │   ├── CaptureGuideScreen.tsx
│   │   │   │   │   │   └── CaptureSuccessScreen.tsx
│   │   │   │   │   └── status/
│   │   │   │   │       ├── StatusTrackingScreen.tsx
│   │   │   │   │       └── ValuationResultScreen.tsx
│   │   │   │   │
│   │   │   │   ├── navigation/        # React Navigation setup
│   │   │   │   │   ├── RootNavigator.tsx
│   │   │   │   │   ├── AuthNavigator.tsx
│   │   │   │   │   ├── MainNavigator.tsx
│   │   │   │   │   └── types.ts
│   │   │   │   │
│   │   │   │   ├── hooks/             # Custom hooks
│   │   │   │   │   ├── useAuth.ts
│   │   │   │   │   ├── useProperty.ts
│   │   │   │   │   ├── useCamera.ts
│   │   │   │   │   ├── useLocation.ts
│   │   │   │   │   └── useSocket.ts
│   │   │   │   │
│   │   │   │   ├── services/          # API service layer
│   │   │   │   │   ├── api.client.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── property.service.ts
│   │   │   │   │   └── socket.service.ts
│   │   │   │   │
│   │   │   │   ├── stores/            # Zustand stores
│   │   │   │   │   ├── auth.store.ts
│   │   │   │   │   ├── property.store.ts
│   │   │   │   │   └── ui.store.ts
│   │   │   │   │
│   │   │   │   ├── theme/             # Aditya Birla theme
│   │   │   │   │   ├── colors.ts
│   │   │   │   │   ├── typography.ts
│   │   │   │   │   ├── spacing.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── utils/             # Utilities
│   │   │   │   │   ├── validation.ts
│   │   │   │   │   ├── image.utils.ts
│   │   │   │   │   └── date.utils.ts
│   │   │   │   │
│   │   │   │   └── constants/        # App constants
│   │   │   │       ├── config.ts
│   │   │   │       └── property-types.ts
│   │   │   │
│   │   │   ├── android/               # Android native code
│   │   │   ├── ios/                  # iOS native code
│   │   │   ├── app.json
│   │   │   ├── babel.config.js
│   │   │   ├── metro.config.js
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   │
│   │   └── valuer-dashboard/  # Next.js Web App
│   │       ├── src/
│   │       │   ├── app/              # Next.js App Router
│   │       │   │   ├── (auth)/
│   │       │   │   │   ├── login/
│   │       │   │   │   └── layout.tsx
│   │       │   │   ├── (dashboard)/
│   │       │   │   │   ├── layout.tsx
│   │       │   │   │   ├── page.tsx              # Dashboard home
│   │       │   │   │   ├── properties/
│   │       │   │   │   │   ├── page.tsx           # Property list
│   │       │   │   │   └── [id]/
│   │       │   │   │       └── page.tsx           # Property detail
│   │       │   │   ├── valuation/
│   │       │   │   │   ├── page.tsx
│   │       │   │   │   └── [id]/
│   │       │   │   │       └── page.tsx
│   │       │   │   ├── comps/
│   │       │   │   │   └── page.tsx
│   │       │   │   └── settings/
│   │       │   │       └── page.tsx
│   │       │   │   
│   │       │   ├── api/              # API routes (if needed)
│   │       │   │
│   │       │   ├── components/      # Reusable components
│   │       │   │   ├── ui/           # Base UI components
│   │       │   │   │   ├── Button.tsx
│   │       │   │   │   ├── Input.tsx
│   │       │   │   │   ├── Modal.tsx
│   │       │   │   │   └── DataTable.tsx
│   │       │   │   ├── layout/
│   │       │   │   │   ├── Sidebar.tsx
│   │       │   │   │   ├── Header.tsx
│   │       │   │   │   └── DashboardLayout.tsx
│   │       │   │   ├── property/
│   │       │   │   │   ├── PropertyCard.tsx
│   │       │   │   │   ├── PropertyList.tsx
│   │       │   │   │   ├── PropertyDetail.tsx
│   │       │   │   │   └── PhotoGallery.tsx
│   │       │   │   ├── valuation/
│   │       │   │   │   ├── ValuationActions.tsx
│   │       │   │   │   ├── ValuationForm.tsx
│   │       │   │   │   └── CompProperties.tsx
│   │       │   │   └── maps/
│   │       │   │       ├── PropertyMap.tsx
│   │       │   │       └── MapMarker.tsx
│   │       │   │
│   │       │   ├── hooks/            # Custom hooks
│   │       │   │   ├── useProperties.ts
│   │       │   │   ├── useValuation.ts
│   │       │   │   └── useWebSocket.ts
│   │       │   │
│   │       │   ├── lib/              # Utilities
│   │       │   │   ├── api.ts        # API client
│   │       │   │   ├── auth.ts       # Auth utilities
│   │       │   │   ├── utils.ts
│   │       │   │   └── constants.ts
│   │       │   │
│   │       │   ├── stores/           # State management
│   │       │   │
│   │       │   ├── styles/           # Global styles
│   │       │   │   └── globals.css
│   │       │   │
│   │       │   └── types/            # TypeScript types
│   │       │       ├── property.ts
│   │       │       ├── valuation.ts
│   │       │       └── user.ts
│   │       │
│   │       ├── public/               # Static assets
│   │       │   └── images/
│   │       ├── next.config.js
│   │       ├── tailwind.config.ts
│   │       ├── postcss.config.js
│   │       ├── package.json
│   │       └── tsconfig.json
│   │
│   ├── packages/
│   │   ├── ui/                      # Shared UI components
│   │   │   ├── src/
│   │   │   │   ├── components/
│   │   │   │   │   ├── Button/
│   │   │   │   │   ├── Input/
│   │   │   │   │   ├── Card/
│   │   │   │   │   ├── Badge/
│   │   │   │   │   └── index.ts
│   │   │   │   └── theme/
│   │   │   │       ├── colors.ts     # Aditya Birla colors
│   │   │   │       ├── typography.ts
│   │   │   │       └── index.ts
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   │
│   │   ├── types/                  # Shared TypeScript types
│   │   │   ├── src/
│   │   │   │   ├── property.types.ts
│   │   │   │   ├── user.types.ts
│   │   │   │   ├── valuation.types.ts
│   │   │   │   └── api.types.ts
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   │
│   │   └── utils/                   # Shared utilities
│   │       ├── src/
│   │       │   ├── date.ts
│   │       │   ├── currency.ts
│   │       │   ├── validation.ts
│   │       │   └── index.ts
│   │       ├── package.json
│   │       └── tsconfig.json
│   │
│   ├── scripts/                     # Build & deployment scripts
│   │
│   ├── .env.example
│   ├── package.json                 # Root package.json (workspaces)
│   ├── turbo.json                   # Turborepo config
│   └── tsconfig.base.json           # Base TypeScript config
│
│
├── infrastructure/                   # IaC & DevOps
│   ├── terraform/
│   │   ├── backend/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   └── frontend/
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       └── outputs.tf
│   │
│   ├── kubernetes/
│   │   ├── backend-deployment.yaml
│   │   ├── backend-service.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── frontend-service.yaml
│   │   └── ingress.yaml
│   │
│   └── docker/
│       ├── backend.Dockerfile
│       └── frontend.Dockerfile
│
│
├── docs/                            # Documentation
│   ├── architecture/
│   │   ├── system-overview.md
│   │   ├── api-design.md
│   │   └── database-schema.md
│   ├── features/
│   │   ├── property-submission.md
│   │   ├── image-capture.md
│   │   └── valuation-workflow.md
│   └── setup/
│       ├── local-setup.md
│       └── deployment.md
│
│
└── .gitignore
```

---

## 4. Database Schema (SQLAlchemy)

```python
# backend/app/models/user.py
from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, Float, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class Role(enum.Enum):
    CUSTOMER = "CUSTOMER"
    VALUER = "VALUER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    name = Column(String(255), nullable=True)
    role = Column(SQLEnum(Role), default=Role.CUSTOMER)
    hashed_password = Column(String(255), nullable=True)  # None for OTP auth
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    properties = relationship("Property", back_populates="user")
    valuations = relationship("Valuation", back_populates="valuer")


# backend/app/models/property.py
import enum

class PropertyStatus(enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    FOLLOW_UP_REQUIRED = "FOLLOW_UP_REQUIRED"

class PropertyType(enum.Enum):
    APARTMENT = "APARTMENT"
    HOUSE = "HOUSE"
    VILLA = "VILLA"
    PLOT = "PLOT"
    COMMERCIAL = "COMMERCIAL"

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    user = relationship("User", back_populates="properties")
    
    # Property Details
    property_type = Column(SQLEnum(PropertyType), nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    area_sqft = Column(Float, nullable=False)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    floor = Column(Integer, nullable=True)
    total_floors = Column(Integer, nullable=True)
    age = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    
    # Status
    status = Column(SQLEnum(PropertyStatus), default=PropertyStatus.DRAFT)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Valuation
    estimated_value = Column(Float, nullable=True)
    
    # Valuer Notes
    valuer_notes = Column(Text, nullable=True)
    valuer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relations
    photos = relationship("PropertyPhoto", back_populates="property", cascade="all, delete-orphan")
    valuations = relationship("Valuation", back_populates="property")


# backend/app/models/photo.py
class PropertyPhoto(Base):
    __tablename__ = "property_photos"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String(36), ForeignKey("properties.id"), nullable=False, index=True)
    property = relationship("Property", back_populates="photos")
    
    s3_key = Column(String(500), nullable=False)
    s3_url = Column(String(500), nullable=False)
    photo_type = Column(String(50), nullable=False)  # FRONT, BEDROOM, KITCHEN, etc.
    sequence = Column(Integer, nullable=False)
    
    # EXIF Data (captured for fraud prevention)
    captured_at = Column(DateTime(timezone=True), nullable=True)
    gps_latitude = Column(Float, nullable=True)
    gps_longitude = Column(Float, nullable=True)
    device_model = Column(String(100), nullable=True)
    
    # QC Status
    qc_status = Column(String(20), default="PENDING")  # PENDING, APPROVED, REJECTED
    qc_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# backend/app/models/valuation.py
class Valuation(Base):
    __tablename__ = "valuations"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String(36), ForeignKey("properties.id"), nullable=False, index=True)
    property = relationship("Property", back_populates="valuations")
    
    valuer_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    valuer = relationship("User", back_populates="valuations")
    
    # Valuation Details
    market_value = Column(Float, nullable=False)
    forced_sale_value = Column(Float, nullable=True)
    lumsum_value = Column(Float, nullable=True)
    
    # Comps Used
    comp1_id = Column(String(36), ForeignKey("comparables.id"), nullable=True)
    comp2_id = Column(String(36), ForeignKey("comparables.id"), nullable=True)
    comp3_id = Column(String(36), ForeignKey("comparables.id"), nullable=True)
    
    # Notes
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# backend/app/models/comp.py
class Comparable(Base):
    __tablename__ = "comparables"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    property_type = Column(SQLEnum(PropertyType), nullable=False)
    area_sqft = Column(Float, nullable=False)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    price = Column(Float, nullable=False)
    price_per_sqft = Column(Float, nullable=False)
    transaction_date = Column(DateTime(timezone=True), nullable=False)
    distance_km = Column(Float, nullable=True)
    
    # Source
    source = Column(String(50), default="MANUAL")  # MAGICBRICKS, NOBROKER, MANUAL
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

---

## 5. API Endpoints Design
  s3Url           String
  photoType       String    // FRONT, BEDROOM, KITCHEN, etc.
  sequence        Int
  
  // EXIF Data (captured for fraud prevention)
  capturedAt      DateTime
  gpsLatitude     Float?
  gpsLongitude    Float?
  deviceModel     String?
  
  // QC Status
  qcStatus        String    @default("PENDING") // PENDING, APPROVED, REJECTED
  qcNotes         String?
  
  createdAt       DateTime  @default(now())
}

model Valuation {
  id              String    @id @default(uuid())
  propertyId      String
  property        Property  @relation(fields: [propertyId], references: [id])
  
  valuerId        String
  valuer          User      @relation(fields: [valuerId], references: [id])
  
  // Valuation Details
  marketValue     Float
  forcedSaleValue Float?
  lumsumValue     Float?
  
  // Comps Used
  comp1Id         String?
  comp2Id         String?
  comp3Id         String?
  
  // Notes
  notes           String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Comparable {
  id              String    @id @default(uuid())
  address         String
  city            String
  propertyType    PropertyType
  areaSqFt        Float
  bedrooms        Int?
  bathrooms       Int?
  price           Float
  pricePerSqFt    Float
  transactionDate DateTime
  distanceKm      Float?
  
  // Source
  source          String    @default("MANUAL") // MAGICBRICKS, NOBROKER, MANUAL
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

---

## 5. API Endpoints Design

### Authentication
```
POST   /api/auth/login          # Login with phone
POST   /api/auth/verify-otp     # Verify OTP
POST   /api/auth/refresh        # Refresh token
POST   /api/auth/logout         # Logout
```

### Properties
```
GET    /api/properties                      # List properties (filtered by role)
GET    /api/properties/:id                   # Get property detail
POST   /api/properties                       # Create new property
PUT    /api/properties/:id                   # Update property
DELETE /api/properties/:id                   # Delete draft property
POST   /api/properties/:id/submit            # Submit property for review
GET    /api/properties/:id/photos             # Get property photos
POST   /api/properties/:id/photos             # Upload photo (with EXIF)
DELETE /api/properties/:id/photos/:photoId    # Delete photo
```

### Valuations
```
GET    /api/valuations                       # List valuations
GET    /api/valuations/:id                    # Get valuation detail
POST   /api/valuations                        # Create valuation
PUT    /api/valuations/:id                    # Update valuation
POST   /api/valuations/:id/approve            # Approve property
POST   /api/valuations/:id/reject             # Reject property
POST   /api/valuations/:id/follow-up          # Request follow-up
```

### Comparables
```
GET    /api/comps                             # List comps
GET    /api/comps/search                      # Search comps by location
POST   /api/comps                             # Add manual comp
```

### WebSocket Events
```
property:new          # New property submitted
property:updated      # Property status changed
property:photo-added  # New photo uploaded
valuation:created     # Valuation completed
```

---

## 6. Key Implementation Details

### 6.1 Image Capture with GPS/EXIF

```python
# backend/app/services/image_service.py
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import piexif
from datetime import datetime
from typing import Dict, Optional, Tuple
import math

def extract_exif_data(image_path: str) -> Dict:
    """Extract EXIF data from image."""
    exif_data = {}
    image = Image.open(image_path)
    exif_raw = image._getexif()
    
    if exif_raw:
        for tag, value in exif_raw.items():
            tag_name = TAGS.get(tag, tag)
            if tag_name == "GPSInfo":
                gps_data = {}
                for gps_tag in value:
                    gps_tag_name = GPSTAGS.get(gps_tag, gps_tag)
                    gps_data[gps_tag_name] = value[gps_tag]
                exif_data["GPSInfo"] = gps_data
            else:
                exif_data[tag_name] = value
    
    return exif_data

def get_gps_coordinates(exif_data: Dict) -> Optional[Tuple[float, float]]:
    """Extract GPS coordinates from EXIF data."""
    if "GPSInfo" not in exif_data:
        return None
    
    gps_info = exif_data["GPSInfo"]
    
    def convert_to_degrees(value):
        d, m, s = value
        return d + (m / 60.0) + (s / 3600.0)
    
    try:
        lat = convert_to_degrees(gps_info.get("GPSLatitude", [0, 0, 0]))
        lat_ref = gps_info.get("GPSLatitudeRef", "N")
        lon = convert_to_degrees(gps_info.get("GPSLongitude", [0, 0, 0]))
        lon_ref = gps_info.get("GPSLongitudeRef", "E")
        
        if lat_ref == "S":
            lat = -lat
        if lon_ref == "W":
            lon = -lon
            
        return (lat, lon)
    except (TypeError, KeyError, ZeroDivisionError):
        return None

def validate_gps_match(
    photo_gps: Tuple[float, float],
    property_gps: Tuple[float, float],
    tolerance_km: float = 0.5
) -> bool:
    """Validate GPS matches property location (with tolerance)."""
    lat1, lon1 = photo_gps
    lat2, lon2 = property_gps
    
    # Haversine formula
    R = 6371  # Earth's radius in km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) *
         math.sin(delta_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return distance <= tolerance_km
```

### 6.2 Real-time Status Updates

```python
# backend/app/websocket/connection.py
from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {
            "properties": {},
            "valuers": {},
        }
    
    async def connect(self, websocket: WebSocket, room: str, user_id: str):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = {}
        if user_id not in self.active_connections[room]:
            self.active_connections[room][user_id] = []
        self.active_connections[room][user_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, room: str, user_id: str):
        if room in self.active_connections and user_id in self.active_connections[room]:
            self.active_connections[room][user_id] = [
                ws for ws in self.active_connections[room][user_id]
                if ws != websocket
            ]
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_text(json.dumps(message))
    
    async def broadcast_to_room(self, room: str, message: dict):
        if room in self.active_connections:
            for user_id, connections in self.active_connections[room].items():
                for connection in connections:
                    await connection.send_text(json.dumps(message))

manager = ConnectionManager()


# backend/app/api/v1/websocket.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket.connection import manager

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, room: str, user_id: str):
    await manager.connect(websocket, room, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages
    except WebSocketDisconnect:
        manager.disconnect(websocket, room, user_id)
```

### 6.3 Customer App - Guided Camera

```typescript
// frontend/apps/customer-app/src/components/camera/GuidedCamera.tsx
interface GuidedCameraProps {
  photoType: 'FRONT' | 'BEDROOM' | 'KITCHEN' | 'BATHROOM' | 'BALCONY';
  overlayGuide: string;
  onCapture: (photo: CapturedPhoto) => void;
}

const PHOTO_GUIDES = {
  FRONT: {
    guide: 'Position your phone to capture the entire front facade',
    overlay: FrontFacadeOverlay,
    tips: ['Ensure good lighting', 'Include gate/parking if available'],
  },
  BEDROOM: {
    guide: 'Stand in the corner and capture the full room',
    overlay: BedroomCornerOverlay,
    tips: ['Show window if available', 'Include attached bathroom door'],
  },
  // ... other types
};
```

---

## 7. Environment Variables

```bash
# Backend (.env)
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/propflow

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=propflow-uploads

# Google Cloud
GOOGLE_CLOUD_PROJECT=propflow-prod
GOOGLE_APPLICATION_CREDENTIALS=./google-creds.json

# External APIs
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

WHATSAPP_BUSINESS_ID=your-id
WHATSAPP_TOKEN=your-token

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

---

## 8. Development Workflow

### Prerequisites
- Node.js 20 LTS
- Docker & Docker Compose
- PostgreSQL (via Docker)
- Redis (via Docker)
- AWS CLI (for S3)

### Local Setup

```bash
# 1. Clone and install
git clone propflow/propflow
cd propflow
npm install

# 2. Start infrastructure
docker-compose up -d

# 3. Setup backend (Python)
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python scripts/seed.py
uvicorn app.main:app --reload

# 4. Setup frontend
cd ../frontend
npm install
cp .env.example .env.local
npm run dev

# 5. Start mobile app (Expo)
cd apps/customer-app
npm start
```

---

## 9. Aditya Birla Design System Integration

### Brand Colors
```typescript
// frontend/packages/ui/src/theme/colors.ts
export const colors = {
  primary: {
    main: '#E31E24',      // Aditya Birla Red
    light: '#FF4D52',
    dark: '#B4181E',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#1A1A1A',      // Black
    light: '#4D4D4D',
    dark: '#000000',
    contrast: '#FFFFFF',
  },
  // Additional brand colors from Aditya Birla
  accent: {
    gold: '#D4AF37',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    // ... scale
  },
};
```

---

## 10. Build & Deployment Commands

```bash
# Development
npm run dev:mobile              # Start Expo (customer app)
npm run dev:dashboard           # Start Next.js (valuer dashboard)

# Backend (Python)
cd backend
source venv/bin/activate
uvicorn app.main:app --reload   # Development server
celery -A app.tasks worker --loglevel=info  # Background workers

# Testing (Frontend)
npm run test:mobile             # React Native tests
npm run test:dashboard          # Next.js tests

# Testing (Backend)
cd backend
pytest                         # Run all tests
pytest --cov                    # With coverage

# Linting
npm run lint                    # Frontend lint
ruff check .                    # Python lint

# Type checking
npm run typecheck               # Frontend types
mypy app/                       # Python types

# Build
npm run build:dashboard          # Build Next.js app
cd apps/customer-app            # Build mobile
eas build --platform android    # Android APK
eas build --platform ios        # iOS IPA

# Docker
docker-compose up --build       # Full stack in Docker
```

---

## 11. Security Considerations

1. **Authentication**: JWT with short expiry, refresh tokens stored in HTTP-only cookies
2. **Image Integrity**: EXIF validation, GPS timestamp verification
3. **Rate Limiting**: API rate limits per user role
4. **Data Encryption**: TLS in transit, encrypted S3 buckets
5. **Input Validation**: Zod schemas on all endpoints
6. **CORS**: Strict origin allowlist
7. **Audit Logging**: All property status changes logged

---

## 12. Next Steps

1. **Initialize Repository** - Create the monorepo structure
2. **Setup Infrastructure** - Docker Compose for local dev
3. **Build Backend Core** - Auth, Properties, basic CRUD
4. **Build Mobile App Shell** - Navigation, theme, basic screens
5. **Build Dashboard Shell** - Layout, routing, basic screens
6. **Integrate Image Capture** - Camera + EXIF extraction
7. **Integrate Real-time** - Socket.io setup
8. **Connect External APIs** - SMS, WhatsApp, Maps

---

*Build Plan generated for PropFlow - Aditya Birla Capital LAP Self-Valuation Application*
