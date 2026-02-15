# PropFlow: User Journey Document
## Premium Experience Design for Self-Valuation Application

---

## Document Overview

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 14, 2026 | Initial user journey |
| 1.1 | Feb 14, 2026 | Responsive design for mobile/tablet/desktop |

---

## Design Philosophy

### Core Principles

| Principle | Manifestation |
|-----------|---------------|
| **Zero Friction** | Minimum taps, smart defaults, GPS auto-fill, camera-first |
| **Transparent Trust** | Every action explained, real-time progress, clear next steps |
| **Premium Feel** | Smooth animations, generous spacing, refined typography, subtle shadows |
| **Indian Context** | WhatsApp integration, vernacular ready, works on low-end devices |
| **Universal Design** | One experience, every screen — mobile first, tablet optimized, desktop powerful |

### Responsive Design Philosophy

PropFlow uses **adaptive design** — purpose-built experiences for each device category while maintaining brand consistency and feature parity.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEVICE ECOSYSTEM                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   MOBILE (320-767px)           TABLET (768-1024px)      DESKTOP (1025px+) │
│   ─────────────────           ──────────────────       ─────────────────  │
│                                                                             │
│   ┌─────────────┐             ┌─────────────────┐       ┌────────────────┐│
│   │             │             │                 │       │                ││
│   │   One       │             │  Split/         │       │  Split/        ││
│   │   column,   │             │  Adaptive       │       │  Multi-panel   ││
│   │   stacked   │             │  layout         │       │  workspace     ││
│   │             │             │                 │       │                ││
│   └─────────────┘             └─────────────────┘       └────────────────┘│
│                                                                             │
│   Primary: 85% of users      Primary: Valuer        Primary: Valuer       │
│   Customer journey            dashboard, some         dashboard             │
│                               customer tasks                                  │
│                                                                             │
│   Touch-first                 Touch + stylus         Keyboard-first         │
│   Gestures: swipe,           support                Shortcuts               │
│   pinch, tap                 gestures                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Breakpoint System

| Breakpoint | Width | Primary Users | Layout Strategy |
|------------|-------|--------------|----------------|
| xs | 320-479px | Budget phones | Single column, compact spacing |
| sm | 480-767px | Mid-range phones | Single column, comfortable spacing |
| md | 768-1023px | Tablets portrait, small tablets | Adaptive, optional split |
| lg | 1024-1279px | Tablets landscape, small laptops | Split layout available |
| xl | 1280-1535px | Desktop | Full multi-panel workspace |
| 2xl | 1536px+ | Large monitors | Multi-panel with expanded data |

### Device-Specific Optimizations

#### Mobile (Primary: Customer Journey)

```
OPTIMIZATION STRATEGY:
─────────────────────
• Bottom navigation for primary actions
• Thumb-zone friendly (44px minimum touch targets)
• Swipe gestures for navigation
• Camera-first for photo capture
• Pull-to-refresh for status updates
• Haptic feedback for confirmations
• Offline-capable (PWA with service workers)
• Works on 2GB RAM devices
• Optimized for 4G connectivity
```

#### Tablet (Customer + Valuer)

```
OPTIMIZATION STRATEGY:
─────────────────────
• Adaptive layout based on orientation
• Portrait: Stacked single column
• Landscape: Split view when appropriate
• Apple Pencil support for signatures
• Split-screen multitasking support
• Sidebar navigation on landscape
• Floating action buttons
• Hover states for interactive elements
```

#### Desktop (Primary: Valuer Dashboard)

```
OPTIMIZATION STRATEGY:
─────────────────────
• Full sidebar navigation
• Multi-panel workspace
• Keyboard shortcuts always visible
• Mouse hover states and tooltips
• Drag-and-drop file upload
• Right-click context menus
• Resizable panels
• Multiple windows/tabs support
• Print-friendly reports
```

### The 80/20 Rule Application

80% of customer retention comes from **emotional design** — how the app *feels* rather than what it *does*. Every micro-interaction must convey:
- Competence ("This bank knows what they're doing")
- Respect for Time ("They value my time")
- Security ("My data is safe")

---

## User Personas

### Persona 1: Rajesh Sharma (Customer)

| Attribute | Detail |
|-----------|--------|
| Age | 38 |
| Occupation | Small business owner |
| Device | Mid-range Android (₹15,000 phone) |
| Tech Comfort | Moderate — uses WhatsApp, Paytm comfortably |
| Goal | Get LAP quickly for business expansion |
| Anxiety | "Will this be complicated? Will they reject my property?" |
| Time Available | 10-15 minutes during lunch break |

### Persona 2: Priya Menon (Valuer)

| Attribute | Detail |
|-----------|--------|
| Age | 32 |
| Role | Property Valuer at Aditya Birla Capital |
| Daily Volume | 25-40 property reviews |
| Device | Desktop + iPad for field |
| Goal | Clear queue fast, flag issues accurately |
| Pain Points | "Too many tabs. Photos don't load. No context." |
| KPI | Reviews per hour, accuracy rate |

---

# CUSTOMER JOURNEY

---

## Screen 1: Welcome & Trust Building

### Visual Design

#### Mobile (Default)
```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────────┐         │
│         │   ABC LOGO      │         │
│         │   (Animated)    │         │
│         └─────────────────┘         │
│                                     │
│         Property Valuation           │
│         Made Simple                 │
│                                     │
│    Get your property valued in      │
│    under 5 hours — from your        │
│    phone. No visits needed.         │
│                                     │
│    ┌─────────────────────────────┐  │
│    │   🔒 Bank-grade security   │  │
│    │   ⚡ 5-hour turnaround     │  │
│    │   ✓ 50,000+ properties    │  │
│    └─────────────────────────────┘  │
│                                     │
│    ┌─────────────────────────────┐  │
│    │     GET STARTED             │  │
│    │     with mobile number      │  │
│    └─────────────────────────────┘  │
│                                     │
│         Already started?            │
│           Track Here →              │
│                                     │
└─────────────────────────────────────┘
```

#### Tablet (768px+)
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│         ┌─────────────────┐         ┌─────────────────────────────┐  │
│         │   ABC LOGO      │         │  Property Valuation        │  │
│         │   (Animated)    │         │  Made Simple               │  │
│         └─────────────────┘         │                            │  │
│                                     │  Get your property valued   │  │
│                                     │  in under 5 hours — from    │  │
│                                     │  your phone. No visits.    │  │
│                                     │                            │  │
│  ┌─────────────────────────────┐    │  ┌──────────────────────┐   │  │
│  │   🔒 Bank-grade security   │    │  │  GET STARTED        │   │  │
│  │   ⚡ 5-hour turnaround     │    │  │  with mobile number │   │  │
│  │   ✓ 50,000+ properties    │    │  └──────────────────────┘   │  │
│  └─────────────────────────────┘    │                            │  │
│                                     │  Already started?           │  │
│                                     │  Track Here →              │  │
│                                     └─────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Desktop (1024px+)
```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│         ┌─────────────────┐                   ┌─────────────────────────────┐   │
│         │   ABC LOGO      │                   │  Property Valuation        │   │
│         │   (Animated)    │                   │  Made Simple               │   │
│         └─────────────────┘                   │                            │   │
│                                                 │  Get your property valued   │   │
│  ┌─────────────────────────────────────────┐   │  in under 5 hours — from   │   │
│  │   🔒 Bank-grade security                 │   │  your phone. No visits.    │   │
│  │   ⚡ 5-hour turnaround                   │   │                            │   │
│  │   ✓ 50,000+ properties                  │   │  ┌──────────────────────┐ │   │
│  └─────────────────────────────────────────┘   │  │  GET STARTED          │ │   │
│                                                 │  │  with mobile number   │ │   │
│                                                 │  └──────────────────────┘ │   │
│                                                 │                            │   │
│                                                 │  Already started?          │   │
│                                                 │  Track Here →             │   │
│                                                 └─────────────────────────────┘   │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

### UX Details

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Animation | Logo fades in (600ms), then tagline slides up (400ms) | Same, slightly slower (700ms) | Same, 800ms for larger screens |
| Trust Badges | Subtle card with icons, horizontal scroll if needed | Horizontal row | Grid layout 3x1 |
| CTA Button | Full width, 56px height | 280px width, centered | 320px width, centered |
| Secondary Link | Below CTA | Beside CTA on right | Beside CTA on right |
| Background | Soft gradient | Same | Same, can add subtle patterns |

### Responsive Interactions

| Interaction | Mobile | Tablet | Desktop |
|-------------|--------|--------|--------|
| CTA Tap | Scale 0.98, haptic feedback | Scale 0.98 | Scale 0.98 + hover glow |
| Link Hover | Underline on tap | Underline | Underline + color shift |
| Trust Badge | Tap to expand details | Hover for tooltip | Hover for tooltip |

### Micro-Copy Strategy

| What User Sees | Why It Works |
|----------------|--------------|
| "Get your property valued" | Outcome-focused, not feature-focused |
| "from your phone" | Emphasizes convenience |
| "No visits needed" | Addresses #1 anxiety immediately |
| "Bank-grade security" | Trust without being preachy |

### Error States

| Scenario | Message | Action |
|----------|---------|--------|
| Slow network | "Checking connection..." | Retry button |
| App outdated | "Update required for security" | Deep link to store |

---

## Screen 2: OTP Verification

### Visual Design

#### Mobile (Default)
```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│    Enter Mobile Number              │
│                                     │
│    ┌─────────────────────────────┐  │
│    │  +91 │  9_________          │  │
│    └─────────────────────────────┘  │
│                                     │
│    We'll send a 6-digit OTP         │
│                                     │
│    ┌─────────────────────────────┐  │
│    │        SEND OTP             │  │
│    └─────────────────────────────┘  │
│                                     │
│         ────────────────            │
│                                     │
│    ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
│    │ 4 │ │ 2 │ │ 7 │ │   │ │   │ │   │
│    └───┘ └───┘ └───┘ └───┘ └───┘ └───┘
│                                     │
│    Enter 6-digit OTP                │
│                                     │
│    Resend in 0:28                   │
│                                     │
│    ┌─────────────────────────────┐  │
│    │        VERIFY →             │  │
│    └─────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

#### Tablet / Desktop
```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back                         Enter Mobile Number                 │
│                                                                     │
│    ┌─────────────────────────────────────────────────────────────┐  │
│    │  +91 │  9_________                                         │  │
│    └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│    We'll send a 6-digit OTP                                        │
│                                                                     │
│    ┌───────────────────────────────┐                              │
│    │         SEND OTP               │                              │
│    └───────────────────────────────┘                              │
│                                                                     │
│           ─────────────────────                                    │
│                                                                     │
│    ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                          │
│    │ 4 │ │ 2 │ │ 7 │ │   │ │   │ │   │                          │
│    └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                          │
│                                                                     │
│    Enter 6-digit OTP                                               │
│    Resend in 0:28                                                  │
│                                                                     │
│    ┌───────────────────────────────┐                              │
│    │         VERIFY →               │                              │
│    └───────────────────────────────┘                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### UX Details

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|--------|
| OTP Boxes | 6 individual boxes, full width | Same, max-width 480px centered | Same, max-width 520px |
| Auto-focus | Yes, next box | Same | Same |
| Timer | Below boxes | Same | Same |
| Number Pad | System native | System native | System native |
| Auto-read OTP | Android SMS Retriever | Same + clipboard fallback | Same + clipboard fallback |

### Premium Touches

1. **Auto-fill Animation**: OTP fills with subtle scale animation (1.05 → 1.0)
2. **Success Haptic**: Light vibration when OTP verified (mobile/tablet)
3. **Smart Keyboard**: Numeric keypad auto-opens
4. **Paste Support**: Paste full OTP (123456) fills all boxes

### Error States

| Scenario | Message | Recovery |
|----------|---------|----------|
| Invalid OTP | "That doesn't look right. Try again?" | Shake animation, clear boxes |
| OTP expired | "OTP expired. Sending new one..." | Auto-trigger resend |
| Too many attempts | "Let's verify it's you. Call support: 1800-XXX" | Support call button |

---

## Screen 3: Property Type Selection

### Visual Design
```
┌─────────────────────────────────────┐
│  Step 1 of 4                        │
│  ████████░░░░░░░░░░░░  25%          │
│                                     │
│    What type of property?           │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🏢                          │    │
│  │  Apartment / Flat           │    │
│  │  Multi-storey residential   │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🏠                          │    │
│  │  Independent House          │    │
│  │  Standalone building        │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🏗️                          │    │
│  │  Plot / Land                │    │
│  │  Undeveloped property       │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🏭                          │    │
│  │  Commercial Property        │    │
│  │  Office, shop, warehouse    │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### UX Details

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|--------|
| Cards | Full width, stacked | 2 columns | 4 columns in row |
| Height | 120px | 140px | 160px |
| Selection | Red left border | Same | Same |
| Auto-advance | 300ms delay | Same | Same |
| Back button | Always visible | Same | Same |

### Interaction Design

```
User taps "Apartment" →
  Card scales up (1.02) →
  Checkmark fades in (200ms) →
  Red border animates from left →
  After 400ms, screen slides left →
  Next screen slides in from right
```

---

## Screen 4: Property Details

### Visual Design
```
┌─────────────────────────────────────┐
│  Step 2 of 4                        │
│  ████████████░░░░░░░░  50%          │
│                                     │
│    Tell us about your property      │
│                                     │
│    BHK Configuration                │
│    ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐
│    │ 1RK ││ 1BHK││ 2BHK││ 3BHK││ 4+  │
│    └─────┘└─────┘└─────┘└─────┘└─────┘
│                                     │
│    Built-up Area                     │
│    ┌─────────────────────────────┐  │
│    │  1,250          sq.ft.      │  │
│    └─────────────────────────────┘  │
│         ───●──────────────          │
│        500    5000 sq.ft.           │
│                                     │
│    Property Age                     │
│    ┌─────────────────────────────┐  │
│    │  5-10 years            ▼    │  │
│    └─────────────────────────────┘  │
│                                     │
│    Floor (if applicable)            │
│    ┌─────────────────────────────┐  │
│    │  3rd of 7 floors       ▼    │  │
│    └─────────────────────────────┘  │
│                                     │
│    ┌─────────────────────────────┐  │
│    │        CONTINUE →           │  │
│    └─────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### UX Details

| Element | Specification |
|---------|---------------|
| BHK Selector | Pill buttons, tap to select, no multi-select |
| Area Input | Numeric keypad, comma formatting (1,250 not 1250) |
| Slider | Drag to adjust, haptic feedback at 500 intervals |
| Dropdowns | Native iOS/Android pickers, not custom |
| Smart Defaults | BHK defaults to "2BHK" (most common LAP property) |

### Premium Interactions

1. **Slider with Tooltip**: Shows "1,250 sq.ft. — Ideal for family of 4" as user drags
2. **Contextual Help**: Info icon shows "Built-up area includes walls, carpet doesn't"
3. **Smart Validation**: Real-time check, no error messages until submit

### Data Intelligence

| Input | Smart Behavior |
|-------|----------------|
| BHK selected | Pre-fill typical area range in slider |
| Area > 3000 sq.ft. | Show "Commercial use?" tooltip |
| Age > 20 years | Show "May affect valuation" info |

---

## Screen 5: Location Capture

### Visual Design
```
┌─────────────────────────────────────┐
│  Step 3 of 4                        │
│  ████████████████░░░░  75%          │
│                                     │
│    Where is your property?          │
│                                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │      ┌─────────────────┐        ││
│  │      │                 │        ││
│  │      │   GOOGLE MAP    │        ││
│  │      │   WITH PIN      │        ││
│  │      │                 │        ││
│  │      └─────────────────┘        ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  📍 Location detected               │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  42, Green Valley Apartments    ││
│  │  HSR Layout, Sector 2           ││
│  │  Bengaluru, Karnataka 560102    ││
│  │                                 ││
│  │  🔄 Update location             ││
│  └─────────────────────────────────┘│
│                                     │
│  ⚠️ Make sure you're AT the        │
│     property location for accurate  │
│     verification                    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │    CAPTURE LOCATION →       │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### UX Details

| Element | Specification |
|---------|---------------|
| Map | Google Maps embedded, shows blue dot for current location |
| Auto-detect | GPS starts immediately on screen load |
| Address | Reverse geocoded, editable if needed |
| Accuracy Check | Shows "Accuracy: 5m" for trust |
| Warning | Amber color, not alarming |

### Trust-Building Elements

```
┌─────────────────────────────────────┐
│  🔒 Why we need your location       │
│                                     │
│  ✓ Confirms property exists at      │
│    this address                     │
│  ✓ Prevents fraudulent submissions  │
│  ✓ Speeds up your approval          │
│                                     │
│  Your location is encrypted and     │
│  only used for valuation purposes.  │
│                                     │
│          [ Got it ]                 │
└─────────────────────────────────────┘
```

### Error States

| Scenario | Message | Recovery |
|----------|---------|----------|
| GPS disabled | "Turn on location for accurate capture" | Deep link to Settings |
| Weak signal | "Moving to better signal..." | Animated indicator |
| Address mismatch | "This doesn't match your loan application" | Edit option |

---

## Screen 6: Guided Photo Capture

### Visual Design
```
┌─────────────────────────────────────┐
│  Step 4 of 4                        │
│  ████████████████████  100%         │
│                                     │
│    Capture your property            │
│                                     │
│  ┌───────────┐ ┌───────────┐        │
│  │    ✓      │ │     2     │        │
│  │  Exterior │ │  Living   │        │
│  │           │ │  Room     │        │
│  └───────────┘ └───────────┘        │
│  ┌───────────┐ ┌───────────┐        │
│  │     3     │ │     4     │        │
│  │  Kitchen  │ │ Bedroom   │        │
│  │           │ │           │        │
│  └───────────┘ └───────────┘        │
│  ┌───────────┐ ┌───────────┐        │
│  │     5     │ │     6     │        │
│  │ Bathroom  │ │  Society  │        │
│  │           │ │  Amenities│        │
│  └───────────┘ └───────────┘        │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  📸 LIVING ROOM                     │
│                                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │    ┌─────────────────────┐      ││
│  │    │                     │      ││
│  │    │   OVERLAY GUIDE     │      ││
│  │    │   (room outline)    │      ││
│  │    │                     │      ││
│  │    └─────────────────────┘      ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  💡 Stand in corner facing window  │
│     Include furniture for scale     │
│                                     │
│  ┌───────────┐    ┌───────────────┐ │
│  │  ⚡ FLASH │    │   TAKE PHOTO  │ │
│  └───────────┘    └───────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Photo Requirements Matrix

| Photo # | Type | Required | Guidance | Why It Matters |
|---------|------|----------|----------|----------------|
| 1 | Building Exterior | ✓ | "Show full building, include entrance" | Location verification |
| 2 | Living Room | ✓ | "Stand in corner, include window" | Space assessment |
| 3 | Kitchen | ✓ | "Show counter, appliances visible" | Condition check |
| 4 | Master Bedroom | ✓ | "Include built-in wardrobe" | Space verification |
| 5 | Bathroom | ✓ | "Show fittings, ventilation" | Condition score |
| 6 | Society/Building | ○ | "Club house, parking, lift" | Premium assessment |

### Camera-Only Enforcement

```
TECHNICAL IMPLEMENTATION:
─────────────────────────
• No gallery picker — camera intent only
• EXIF metadata captured automatically
• Timestamp verification against server time
• GPS coordinates embedded in EXIF
• Screenshot detection = auto-reject
```

### Real-Time Quality Check

| Check | Threshold | User Feedback |
|-------|-----------|---------------|
| Blur | Sharpness score < 30 | "Photo is blurry. Hold steady and retake." |
| Darkness | Brightness < 40 | "Too dark. Turn on lights and retake." |
| Glare | Highlight ratio > 70% | "Glare detected. Angle away from light." |
| Orientation | Not level | "Level your phone for best results." |

### Photo Guidance Overlays

```
LIVING ROOM OVERLAY:
─────────────────────
┌─────────────────────────────┐
│                             │
│    ╔═════════════════╗      │
│    ║                 ║      │
│    ║   KEEP ROOM     ║      │
│    ║   INSIDE BOX    ║      │
│    ║                 ║      │
│    ╚═════════════════╝      │
│                             │
│    🪟 ← Include window      │
│                             │
└─────────────────────────────┘
```

### Audio Guidance (Optional)

```
🎬 TAP FOR VOICE GUIDE

"Stand in the far corner of your living room.
Make sure the window is visible in frame.
Hold your phone horizontally.
Tap to capture when ready."
```

---

## Screen 7: Photo Review & Retake

### Visual Design
```
┌─────────────────────────────────────┐
│                                     │
│    Review your photos               │
│                                     │
│  ┌───────────┐ ┌───────────┐        │
│  │   ✓ OK    │ │   ✓ OK    │        │
│  │  [IMG 1]  │ │  [IMG 2]  │        │
│  │  Exterior │ │  Living   │        │
│  │    🔄     │ │    🔄     │        │
│  └───────────┘ └───────────┘        │
│  ┌───────────┐ ┌───────────┐        │
│  │   ✓ OK    │ │ ⚠️ RETAKE │        │
│  │  [IMG 3]  │ │  [IMG 4]  │        │
│  │  Kitchen  │ │ Bedroom   │
│  │    🔄     │ │  Too dark │
│  └───────────┘ └───────────┘        │
│  ┌───────────┐ ┌───────────┐        │
│  │   ✓ OK    │ │   ✓ OK    │        │
│  │  [IMG 5]  │ │  [IMG 6]  │        │
│  │ Bathroom  │ │ Society   │        │
│  │    🔄     │ │    🔄     │        │
│  └───────────┘ └───────────┘        │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  ⚠️ 1 photo needs attention         │
│                                     │
│  ┌─────────────────────────────┐    │
│  │    RETAKE BEDROOM PHOTO     │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │    SUBMIT ALL PHOTOS →      │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### UX Details

| Element | Specification |
|---------|---------------|
| Status Badge | Green checkmark or amber warning |
| Retake Button | Per photo, takes back to camera |
| Quality Score | "Blur: Low" or "Lighting: Good" labels |
| Smart Order | Problem photos shown first |

---

## Screen 8: Submission Confirmation

### Visual Design
```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────────┐         │
│         │                 │         │
│         │    ✅ SUCCESS   │         │
│         │    ANIMATION    │         │
│         │                 │         │
│         └─────────────────┘         │
│                                     │
│    Submission Complete!             │
│                                     │
│    Reference: PF-2026-0214-7842     │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  What happens next?             ││
│  │                                 ││
│  │  1. Our valuer reviews your     ││
│  │     photos (within 4 hours)     ││
│  │                                 ││
│  │  2. You'll get SMS/WhatsApp     ││
│  │     with valuation status       ││
│  │                                 ││
│  │  3. If approved, loan process   ││
│  │     continues automatically     ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  📊 Track Status                ││
│  │                                 ││
│  │  ● Pending Review               ││
│  │  ○ Valuation in Progress        ││
│  │  ○ Complete                     ││
│  └─────────────────────────────────┘│
│                                     │
│  Expected completion: Today, 4:30 PM│
│                                     │
│  ┌─────────────────────────────┐    │
│  │    SHARE VIA WHATSAPP       │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### Premium Touches

1. **Success Animation**: Checkmark draws itself, confetti burst
2. **Reference Number**: Large, tappable to copy
3. **Timeline**: Real progress indicator, not fake
4. **Share Integration**: WhatsApp deep link with pre-filled message

### Notification Strategy

| Channel | Timing | Content |
|---------|--------|---------|
| SMS | Immediate | "PropFlow: Submission received. Reference: PF-2026-0214-7842. Track: propflow.in/t/7842" |
| WhatsApp | +5 min | Rich card with status timeline |
| Push | On status change | "Good news! Your valuation is complete." |

---

## Screen 9: Status Tracking

### Visual Design
```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│    PF-2026-0214-7842                │
│    Submitted 2 hours ago            │
│                                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │  ✓ Submitted                    ││
│  │     Today, 11:30 AM             ││
│  │     │                           ││
│  │     ▼                           ││
│  │  ● In Review                    ││
│  │     Priya M. is reviewing       ││
│  │     Started 15 min ago          ││
│  │     │                           ││
│  │     ○                           ││
│  │  ○ Valuation Complete           ││
│  │     Expected by 3:30 PM         ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  📷 Your Photos (6)             ││
│  │                                 ││
│  │  [thumb] [thumb] [thumb]        ││
│  │  [thumb] [thumb] [thumb]        ││
│  │                                 ││
│  │  Tap to view full size          ││
│  └─────────────────────────────────┘│
│                                     │
│  Need help? Call 1800-XXX-XXXX     │
│                                     │
└─────────────────────────────────────┘
```

### Real-Time Updates

```
WEBSOCKET EVENTS:
─────────────────
• submission_received → "Submitted" state
• review_started → "In Review" + valuer name
• status_changed → Push notification + UI update
```

---

## Screen 10: Valuation Complete (Success)

### Visual Design
```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────────┐         │
│         │   🎉 COMPLETE   │         │
│         └─────────────────┘         │
│                                     │
│    Your valuation is ready!         │
│                                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │  Estimated Value Range          ││
│  │                                 ││
│  │  ₹ 72 - 78 Lakhs               ││
│  │                                 ││
│  │  Based on 3 comparable          ││
│  │  properties in your area        ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  Why this value?                ││
│  │                                 ││
│  │  Similar flat on 3rd floor      ││
│  │  sold for ₹75L last month       ││
│  │                                 ││
│  │  Your area avg: ₹6,200/sq.ft.  ││
│  │                                 ││
│  │  [View 3 comparable properties] ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────┐    │
│  │  DOWNLOAD VALUATION REPORT  │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  CONTINUE LOAN APPLICATION  │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

## Screen 11: Follow-up Required (Partial Success)

### Visual Design
```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────────┐         │
│         │   ⚠️ ACTION     │         │
│         │   NEEDED        │         │
│         └─────────────────┘         │
│                                     │
│    We need a bit more info          │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  Kitchen photo issues:          ││
│  │                                 ││
│  │  • Photo is too dark            ││
│  │  • Counter not visible          ││
│  │                                 ││
│  │  Please retake this photo       ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  📷 Kitchen Photo               ││
│  │                                 ││
│  │  ┌───────────────────────┐      ││
│  │  │                       │      ││
│  │  │   [CURRENT DARK]      │      ││
│  │  │                       │      ││
│  │  └───────────────────────┘      ││
│  │                                 ││
│  │  💡 Turn on lights and face     ││
│  │     the counter                 ││
│  │                                 ││
│  │  ┌───────────────────────────┐  ││
│  │  │     RETAKE PHOTO          │  ││
│  │  └───────────────────────────┘  ││
│  └─────────────────────────────────┘│
│                                     │
│  Your valuation is paused until     │
│  we receive this photo.             │
│                                     │
└─────────────────────────────────────┘
```

---

# VALUER DASHBOARD JOURNEY

---

## Screen V1: Login & Queue Overview

### Visual Design
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ☰  PropFlow Valuer              🔔 3      Priya M. ▼                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Good morning, Priya                                    📊 This Week   │
│                                                         ─────────────  │
│  ┌─────────────────────┐  ┌─────────────────────┐      │   Mon ███████ │
│  │  📋 PENDING         │  │  ✅ COMPLETED       │      │   Tue ██████  │
│  │                     │  │                     │      │   Wed ███████ │
│  │       12            │  │       28            │      │   Thu █████   │
│  │                     │  │                     │      │   Fri ███████ │
│  │  3 urgent           │  │  Today: 8           │      │               │
│  └─────────────────────┘  └─────────────────────┘      └───────────────┘
│                                                                         │
│  Queue                                  Sort: Oldest ▼  Filter: All ▼  │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 🔴  Rajesh Sharma        2BHK • 1250 sq.ft. • HSR Layout         │  │
│  │     Submitted 45 min ago  •  6 photos  •  PF-2026-0214-7842      │  │
│  │                                            [START REVIEW →]       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 🟡  Amit Kumar           3BHK • 1800 sq.ft. • Whitefield         │  │
│  │     Submitted 2 hours ago  •  5 photos  •  PF-2026-0214-7841    │  │
│  │                                            [START REVIEW →]       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ ⚪  Sneha Patel          2BHK • 1100 sq.ft. • Koramangala        │  │
│  │     Submitted 4 hours ago  •  6 photos  •  PF-2026-0214-7840    │  │
│  │                                            [START REVIEW →]       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Priority Indicators

| Color | Meaning | SLA |
|-------|---------|-----|
| 🔴 Red | Urgent — SLA at risk | <1 hour remaining |
| 🟡 Yellow | Attention soon | <3 hours remaining |
| ⚪ White | Normal priority | >3 hours remaining |

### Keyboard Shortcuts (Always Visible)

| Key | Action |
|-----|--------|
| `J` / `K` | Navigate up/down queue |
| `Enter` | Open selected property |
| `1-9` | Jump to position in queue |
| `?` | Show all shortcuts |

---

## Screen V2: Property Review — Split Screen

### Visual Design

#### Desktop (Default - 1024px+)
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back    PF-2026-0214-7842    Rajesh Sharma    ⏱️ 3:42              │
├────────────────────────────────────────┬────────────────────────────────┤
│                                        │                                │
│  ┌──────────────────────────────────┐  │  PROPERTY DETAILS             │
│  │                                  │  │  ─────────────────            │
│  │                                  │  │                                │
│  │       [MAIN PHOTO -              │  │  Type: 2BHK Apartment         │
│  │        Living Room]              │  │  Area: 1,250 sq.ft.           │
│  │                                  │  │  Age: 5-10 years             │
│  │                                  │  │  Floor: 3rd of 7             │
│  │                                  │  │                                │
│  │                                  │  │  LOCATION                    │
│  └──────────────────────────────────┘  │  ─────────                    │
│                                        │                                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │  📍 HSR Layout, Sector 2     │
│  │ 1   │ │ 2   │ │ 3   │ │ 4   │      │  Bengaluru, KA 560102        │
│  │ Ext │ │ Liv │ │ Kit │ │ Bed │      │                                │
│  └─────┘ └─────┘ └─────┘ └─────┘      │  ┌────────────────────────┐   │
│  ┌─────┐ ┌─────┐                      │  │                        │   │
│  │ 5   │ │ 6   │                      │  │   [GOOGLE MAP WITH     │   │
│  │ Bath│ │ Soc │                      │  │    PIN DROP]           │   │
│  └─────┘ └─────┘                      │  │                        │   │
│                                        │  │   Accuracy: 4m          │   │
│  ◀ Prev    2/6    Next ▶              │  └────────────────────────┘   │
│                                        │                                │
│  QUALITY CHECK                         │  COMPARABLE PROPERTIES        │
│  ─────────────                         │  ────────────────────         │
│  ✓ Sharp: 87/100                       │                                │
│  ✓ Bright: Good                        │  ┌──────────────────────────┐ │
│  ✓ EXIF: Valid                         │  │ 1. Similar 2BHK, 4th fl  │ │
│  ✓ GPS: 4m accuracy                    │  │    Sold: ₹75L, Jan 2026 │ │
│                                        │  │    0.3 km away           │ │
│                                        │  └──────────────────────────┘ │
│                                        │                                │
│                                        │  ┌──────────────────────────┐ │
│                                        │  │ 2. Similar 2BHK, 2nd fl  │ │
│                                        │  │    Listed: ₹72L         │ │
│                                        │  │    0.5 km away          │ │
│                                        │  └──────────────────────────┘ │
│                                        │                                │
├────────────────────────────────────────┴────────────────────────────────┤
│                                                                         │
│  Notes: ┌─────────────────────────────────────────────────────────────┐│
│         │ Good condition, well-maintained. Kitchen slightly dated.     ││
│         └─────────────────────────────────────────────────────────────┘│
│                                                                         │
│  [A] Approve    [R] Request Follow-up    [F] Flag for Supervisor      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Tablet Landscape (768px - 1023px)
```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back   PF-2026-0214-7842   Rajesh Sharma   ⏱️ 3:42             │
├────────────────────────────────────┬─────────────────────────────────┤
│                                    │  PROPERTY DETAILS               │
│  ┌────────────────────────────┐   │  ────────────                   │
│  │                            │   │  2BHK • 1,250 sq.ft.            │
│  │      [MAIN PHOTO]          │   │  5-10 years • Floor 3/7       │
│  │                            │   │                                 │
│  └────────────────────────────┘   │  📍 HSR Layout, Sector 2       │
│                                    │  Bengaluru, KA 560102          │
│  ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐        │                                 │
│  │1 ││2 ││3 ││4 ││5 ││6 │        │  ┌─────────────────────────┐   │
│  └──┘└──┘└──┘└──┘└──┘└──┘        │  │    [MAP]  Accuracy: 4m │   │
│                                    │  └─────────────────────────┘   │
│  ◀ 2/6 ▶                           │                                 │
│                                    │  COMPARABLE PROPERTIES          │
│  ✓ Sharp: 87/100                    │  ─────────────────────          │
│  ✓ Bright: Good                     │  1. ₹75L, 0.3km              │
│  ✓ EXIF: Valid                     │  2. ₹72L, 0.5km              │
│                                    │                                 │
├────────────────────────────────────┴─────────────────────────────────┤
│  Notes: [Good condition, well-maintained...]                         │
│                                                                         │
│  [A] Approve    [R] Follow-up    [F] Flag                            │
└─────────────────────────────────────────────────────────────────────┘
```

#### Mobile / Tablet Portrait (320px - 767px)
```
┌─────────────────────────────────────┐
│  ← Back   PF-2026-0214-7842        │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │      [MAIN PHOTO]           │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  [1]Ext [2]Liv [3]Kit [4]Bed       │
│  [5]Bath [6]Soc                    │
│                                     │
│  ◀ 2/6 ▶                           │
│                                     │
│  ───────────────────────────────    │
│                                     │
│  📍 HSR Layout, Sector 2           │
│  Bengaluru, KA 560102              │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Type: 2BHK • 1,250 sq.ft.  │    │
│  │  Age: 5-10 years            │    │
│  │  Floor: 3rd of 7            │    │
│  └─────────────────────────────┘    │
│                                     │
│  ✓ Sharp: 87/100  ✓ Bright: Good   │
│                                     │
│  ───────────────────────────────    │
│  Notes: [Tap to add...]            │
│                                     │
│  ┌─────────────────────────────┐    │
│  │    [A] APPROVE               │    │
│  └─────────────────────────────┘    │
│  ┌───────────┐ ┌───────────┐        │
│  │  Follow-  │ │   Flag   │        │
│  │    up    │ │           │        │
│  └───────────┘ └───────────┘        │
│                                     │
└─────────────────────────────────────┘
```

### Responsive Features

| Feature | Mobile | Tablet | Desktop |
|---------|--------|--------|--------|
| Photo Size | 60% width | 65% width | 70% width |
| Thumbnails | 2 rows of 3 | 2 rows of 3 | 2 rows of 3 |
| Map | Collapsed, tap to expand | Always visible | Always visible |
| Comps | Tabs or expandable | Side panel | Side panel |
| Notes | Collapsible section | Always visible | Always visible |
| Action Buttons | Full width, stacked | Side by side | Side by side |
| Keyboard Shortcuts | Not available | Optional | Always visible |

### Keyboard-First Design

| Key | Action | Result |
|-----|--------|--------|
| `←` / `→` | Previous/Next photo | Instant navigation |
| `A` | Approve | Modal confirmation → Status update |
| `R` | Request follow-up | Opens template selector |
| `F` | Flag | Opens escalation modal |
| `E` | Expand photo | Fullscreen view |
| `M` | Toggle map | Show/hide map panel |
| `N` | Focus notes | Jump to notes field |
| `Esc` | Back to queue | Save draft if notes exist |

### Photo Navigation

```
BEHAVIOR:
─────────
• Click thumbnail → Main view updates
• Arrow keys → Navigate with haptic (mobile)
• Auto-advance option → 3s per photo
• Fullscreen → `E` key or click
• Zoom → Pinch on mobile, scroll on desktop
```

---

## Screen V3: Follow-up Request Modal

### Visual Design
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                          REQUEST FOLLOW-UP                        │  │
│  │                                                                   │  │
│  │  What needs attention?                                           │  │
│  │                                                                   │  │
│  │  ☑ Kitchen photo too dark                                        │  │
│  │  ☑ Counter not clearly visible                                   │  │
│  │  ☐ Bedroom photo blurry                                          │  │
│  │  ☐ Bathroom fittings not shown                                   │  │
│  │  ☐ Exterior photo incomplete                                     │  │
│  │  ☐ Location mismatch                                             │  │
│  │  ☐ Other issue (specify below)                                   │  │
│  │                                                                   │  │
│  │  Message to customer:                                            │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ Please retake your kitchen photo with better lighting.      │ │  │
│  │  │ Make sure the counter and appliances are clearly visible.   │ │  │
│  │  │ Stand near the entrance for the best angle.                 │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                   │  │
│  │  📷 Photos to retake:                                            │  │
│  │  ┌─────┐                                                         │  │
│  │  │ 3   │  Kitchen                                                │  │
│  │  └─────┘                                                         │  │
│  │                                                                   │  │
│  │                              [Cancel]    [SEND REQUEST →]        │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Templated Messages

| Issue Type | Auto-Generated Message |
|------------|------------------------|
| Photo too dark | "Please retake [room] photo with better lighting. Turn on all lights and open curtains." |
| Photo blurry | "The [room] photo appears blurry. Hold your phone steady or use a stable surface." |
| Incomplete view | "Please capture the full [room] including [specific element]." |
| Location mismatch | "Your GPS location doesn't match the property address. Please capture from the property location." |

---

## Screen V4: Approval with Valuation

### Visual Design
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                         APPROVE VALUATION                         │  │
│  │                                                                   │  │
│  │  Estimated Value Range                                           │  │
│  │                                                                   │  │
│  │  ┌───────────────────────────────────────────────────────────┐   │  │
│  │  │                                                           │   │  │
│  │  │      ₹ 72 Lakhs  ─────────────────  ₹ 78 Lakhs           │   │  │
│  │  │                   ●                                       │   │  │
│  │  │               Suggested: ₹ 75 Lakhs                       │   │  │
│  │  │                                                           │   │  │
│  │  └───────────────────────────────────────────────────────────┘   │  │
│  │                                                                   │  │
│  │  Adjustment (if needed):                                         │  │
│  │  ┌───────────────────────────────────────────────────────────┐   │  │
│  │  │  Adjust for condition:                          [ -5% ▼ ] │   │  │
│  │  │  Reason: Kitchen slightly dated                            │   │  │
│  │  └───────────────────────────────────────────────────────────┘   │  │
│  │                                                                   │  │
│  │  Final Valuation: ₹ 71.25 Lakhs                                  │  │
│  │                                                                   │  │
│  │  Confidence Level: ████████░░ High                               │  │
│  │                                                                   │  │
│  │  Valuation Notes:                                                │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ Well-maintained property in prime location. Good natural    │ │  │
│  │  │ light and ventilation. Minor deduction for dated kitchen.   │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                   │  │
│  │                    [Save Draft]    [APPROVE →]                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Confidence Scoring

| Score | Visual | Meaning |
|-------|--------|---------|
| 90-100 | ██████████ | High — Strong comps, clear photos |
| 70-89 | ████████░░ | Good — Adequate comps, minor questions |
| 50-69 | █████░░░░░ | Medium — Limited comps, request review |
| <50 | ██░░░░░░░░ | Low — Flag for supervisor |

---

## Screen V5: Completion Summary

### Visual Design
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ✅ Valuation Complete                                                  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │  PF-2026-0214-7842                                               │  │
│  │  Rajesh Sharma • 2BHK • HSR Layout                               │  │
│  │                                                                   │  │
│  │  Valuation: ₹ 71.25 Lakhs                                        │  │
│  │  Review time: 4 minutes 32 seconds                               │  │
│  │                                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Customer has been notified via SMS and WhatsApp.                      │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │  📄 View Audit  │  │  📧 Email Report│  │  📋 Copy Link   │        │
│  │     Trail       │  │                 │  │                 │        │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
│  Next in queue:                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Amit Kumar • 3BHK • Whitefield • Submitted 2h ago • 5 photos    │  │
│  │                                            [START REVIEW →]       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│                    [Back to Queue]    [Review Next →]                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Responsive Typography

### Fluid Type Scale

PropFlow uses **fluid typography** that scales smoothly between breakpoints:

```
CSS IMPLEMENTATION (clamp):
────────────────────────────
font-size: clamp(0.875rem, 0.8125rem + 0.3125vw, 1rem);  /* Small */
font-size: clamp(1rem, 0.9375rem + 0.3125vw, 1.125rem);   /* Body */
font-size: clamp(1.25rem, 1.125rem + 0.625vw, 1.5rem);    /* H3 */
font-size: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);         /* H2 */
font-size: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);     /* H1 */
```

### Responsive Type Scale

| Element | Mobile (320-767px) | Tablet (768-1023px) | Desktop (1024px+) |
|---------|-------------------|---------------------|-------------------|
| H1 | 24px | 28px | 32px |
| H2 | 20px | 22px | 24px |
| H3 | 18px | 19px | 20px |
| Body | 16px | 16px | 16px |
| Small | 14px | 14px | 14px |
| Caption | 12px | 12px | 12px |
| Button | 16px | 16px | 16px |

---

## Responsive Spacing

### Fluid Spacing

```
SPACING TOKENS:
────────────────
--space-xs: clamp(0.25rem, 0.1875rem + 0.3125vw, 0.5rem);   /* 4-8px */
--space-sm: clamp(0.5rem, 0.375rem + 0.625vw, 0.75rem);     /* 8-12px */
--space-md: clamp(1rem, 0.75rem + 1.25vw, 1.5rem);           /* 16-24px */
--space-lg: clamp(1.5rem, 1.125rem + 1.875vw, 2rem);         /* 24-32px */
--space-xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);               /* 32-48px */
--space-2xl: clamp(3rem, 2.25rem + 3.75vw, 4rem);            /* 48-64px */
```

### Responsive Padding

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|--------|
| Screen padding | 16px | 24px | 32px |
| Card padding | 16px | 20px | 24px |
| Button padding | 12px 20px | 14px 24px | 16px 24px |
| Input padding | 14px 16px | 16px | 16px |

---

## Responsive Components

### Buttons

```
SIZING ACROSS DEVICES:
──────────────────────
Mobile (xs-sm):
  height: 48px        /* Larger touch target for mobile */
  font-size: 16px
  padding: 12px 20px

Tablet (md):
  height: 52px
  font-size: 16px
  padding: 14px 24px

Desktop (lg+):
  height: 56px
  font-size: 16px
  padding: 16px 24px
```

### Cards

```
RESPONSIVE CARD BEHAVIOR:
─────────────────────────
Mobile:
  - Full width
  - Stack vertically
  - 16px padding
  - Border radius: 12px

Tablet:
  - Full width or 2-column grid
  - 20px padding
  - Border radius: 16px

Desktop:
  - Flexible grid (2-4 columns)
  - 24px padding
  - Border radius: 16px
  - Hover effects enabled
```

### Input Fields

```
RESPONSIVE INPUT SIZING:
────────────────────────
Mobile:
  height: 52px
  font-size: 16px        /* Prevents iOS zoom on focus */
  padding: 14px 16px

Tablet:
  height: 56px
  font-size: 16px
  padding: 16px

Desktop:
  height: 56px
  font-size: 16px
  padding: 16px
  /* Hover/focus states enabled */
```

### Touch Targets

```
MINIMUM TOUCH TARGETS:
──────────────────────
Mobile:    44x44px minimum (Apple HIG)
Tablet:    48x48px recommended
Desktop:   No minimum, but 44x44px for consistency

Icon Buttons:
Mobile:    48x48px with hit area extension
Tablet:    44x44px
Desktop:   40x40px
```

---

## Responsive Navigation

### Customer App Navigation

```
MOBILE (Bottom Navigation):
┌─────────────────────────────────────┐
│                                     │
│         [Screen Content]            │
│                                     │
├─────────────────────────────────────┤
│  🏠 Home   📷 Photos   📊 Status   │
└─────────────────────────────────────┘

TABLET (Top Navigation):
┌─────────────────────────────────────────────────────────────┐
│  ☰ PropFlow                    🏠 Home 📷 Photos 📊 Status │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   [Screen Content]                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

DESKTOP (Top Navigation + Breadcrumbs):
┌─────────────────────────────────────────────────────────────────────┐
│  ☰ PropFlow  ›  Property Valuation  ›  Step 3 of 4    👤 Account  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                      [Screen Content]                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Valuer Dashboard Navigation

```
MOBILE/TABLET (Collapsible Sidebar):
┌─────────────────────────────────────────────────────────────┐
│  ☰  │  Queue (12)  •  Completed  •  Settings              │
├─────┼───────────────────────────────────────────────────────┤
│     │                                                       │
│     │              [Main Content Area]                     │
│     │                                                       │
│     │                                                       │
└─────┴───────────────────────────────────────────────────────┘

DESKTOP (Fixed Sidebar):
┌─────────────────────────────────────────────────────────────┐
│  ☰ PropFlow   │  Queue (12)  •  Completed  •  Reports    │
│                │  ────────────────────────                 │
│  ─────────────│                                            │
│  📋 Queue     │           [Main Content Area]             │
│  ✅ Completed │                                            │
│  📊 Reports   │                                            │
│  ⚙️ Settings  │                                            │
│                │                                            │
└────────────────┴────────────────────────────────────────────┘
```

---

## Responsive Layout Patterns

### Single Column (Mobile)

```
LAYOUT STRUCTURE:
─────────────────
┌─────────────────────┐
│       Header        │
├─────────────────────┤
│                     │
│    Progress Bar     │
├─────────────────────┤
│                     │
│      Content       │
│      (stacked)      │
│                     │
├─────────────────────┤
│                     │
│    CTA / Actions   │
│                     │
└─────────────────────┘
```

### Adaptive Split (Tablet)

```
LANDSCAPE LAYOUT:
─────────────────
┌─────────────────────┬─────────────────────┐
│                     │                     │
│      Content        │    Supporting       │
│      (60%)          │    Info (40%)       │
│                     │                     │
│                     │    - Map            │
│                     │    - Comps          │
│                     │    - Details        │
├─────────────────────┴─────────────────────┤
│              CTA / Actions                │
└───────────────────────────────────────────┘
```

### Multi-Panel Workspace (Desktop)

```
FULL WORKSPACE:
───────────────
┌────────┬─────────────────────┬─────────────────┐
│        │                     │                 │
│  Nav   │    Main Panel      │  Details/Comps  │
│ Sidebar│    (flexible)      │    Panel        │
│  200px │                     │    320px        │
│        │                     │                 │
├────────┴─────────────────────┴─────────────────┤
│              Action Bar / Footer               │
└───────────────────────────────────────────────┘
```

---

## Gesture Support

### Mobile Gestures

| Gesture | Context | Action |
|---------|---------|--------|
| Swipe Left | Any screen | Go to next step |
| Swipe Right | Any screen | Go back |
| Pull Down | Status screen | Refresh status |
| Long Press | Photo thumbnail | View full size |
| Pinch | Photo view | Zoom in/out |
| Double Tap | Photo view | Toggle zoom |

### Tablet Gestures

| Gesture | Context | Action |
|---------|---------|--------|
| Two-finger swipe | Photo gallery | Navigate photos |
| Apple Pencil tap | Any | Primary action |
| Split view | Multitasking | Side-by-side apps |

---

## Animation Across Devices

### Reduced Motion Support

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Device-Specific Animations

| Animation | Mobile | Tablet | Desktop |
|-----------|--------|--------|--------|
| Page transition | Slide | Slide + fade | Slide + fade |
| Button hover | Scale | Scale + glow | Scale + glow + shadow |
| Card hover | None | Scale | Scale + shadow |
| Modal open | Slide up | Fade + scale | Fade + scale |
| Loading | Skeleton | Skeleton | Skeleton + pulse |

---

# Design System

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| ABC Red | `#E31E24` | Primary CTA, selection states, brand |
| ABC Maroon | `#8B0000` | Hover states, emphasis |
| White | `#FFFFFF` | Backgrounds, cards |
| Off-White | `#FAFAFA` | Page backgrounds |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#10B981` | Approved states, checkmarks |
| Warning | `#F59E0B` | Follow-up needed, attention |
| Error | `#EF4444` | Rejected, urgent |
| Info | `#3B82F6` | Informational, links |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#1F2937` | Headings, important text |
| Text Secondary | `#6B7280` | Body text, descriptions |
| Text Muted | `#9CA3AF` | Placeholders, hints |
| Border | `#E5E7EB` | Card borders, dividers |
| Background | `#F3F4F6` | Input backgrounds |

---

## Typography

### Font Stack

```
Primary: Inter (Google Fonts)
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Monospace: 'SF Mono', 'Roboto Mono', monospace
```

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 32px | 700 | 1.2 |
| H2 | 24px | 600 | 1.3 |
| H3 | 20px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Small | 14px | 400 | 1.5 |
| Caption | 12px | 400 | 1.4 |
| Button | 16px | 600 | 1.0 |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing, icon gaps |
| sm | 8px | Small gaps, inline elements |
| md | 16px | Default spacing, card padding |
| lg | 24px | Section gaps |
| xl | 32px | Major section gaps |
| 2xl | 48px | Page-level gaps |

---

## Component Specs

### Buttons

```
PRIMARY BUTTON (Desktop)
┌─────────────────────────────────────┐
│  height: 56px                       │
│  padding: 16px 24px                 │
│  border-radius: 12px                │
│  background: #E31E24                │
│  color: #FFFFFF                     │
│  font-weight: 600                   │
│  box-shadow: 0 2px 8px rgba(0,0,0,0.1)│
│  transition: all 200ms ease         │
└─────────────────────────────────────┘

Hover: background: #8B0000, transform: translateY(-1px)
Active: transform: translateY(0), box-shadow: none
Disabled: opacity: 0.5, cursor: not-allowed
```

### Responsive Button Specs

| Property | Mobile (320-767px) | Tablet (768-1023px) | Desktop (1024px+) |
|----------|-------------------|---------------------|-------------------|
| Height | 48px | 52px | 56px |
| Min Width | 100% | 160px | 200px |
| Border Radius | 10px | 12px | 12px |
| Font Size | 15px | 16px | 16px |
| Font Weight | 600 | 600 | 600 |
| Touch Target | 48x48px | 52x52px | 56x56px |

### Cards

```
STANDARD CARD
┌─────────────────────────────────────┐
│  background: #FFFFFF                │
│  border-radius: 16px                │
│  padding: 20px                      │
│  box-shadow: 0 1px 3px rgba(0,0,0,0.1)│
│  border: 1px solid #E5E7EB          │
└─────────────────────────────────────┘

Hover (if interactive): box-shadow: 0 4px 12px rgba(0,0,0,0.15)
Selected: border-left: 4px solid #E31E24
```

### Input Fields

```
TEXT INPUT
┌─────────────────────────────────────┐
│  height: 56px                       │
│  padding: 16px                      │
│  border-radius: 12px                │
│  border: 1px solid #E5E7EB          │
│  background: #F3F4F6                │
│  font-size: 16px                    │
└─────────────────────────────────────┘

Focus: border-color: #E31E24, box-shadow: 0 0 0 3px rgba(227,30,36,0.1)
Error: border-color: #EF4444
Disabled: opacity: 0.5, cursor: not-allowed
```

---

## Animation Guidelines

### Timing

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro (button hover) | 150ms | ease-out |
| Small (card hover) | 200ms | ease-out |
| Medium (modal) | 300ms | ease-in-out |
| Large (page transition) | 400ms | ease-in-out |

### Page Transitions

```
FORWARD NAVIGATION:
- Current screen slides left (transform: translateX(-100%))
- New screen slides in from right (transform: translateX(100%) → 0)

BACK NAVIGATION:
- Current screen slides right (transform: translateX(100%))
- Previous screen slides in from left (transform: translateX(-100%) → 0)
```

### Success Animations

```
CHECKMARK ANIMATION (600ms):
1. Circle draws (0-300ms)
2. Check draws (300-500ms)
3. Scale bounce (500-600ms)

CONFETTI (optional):
- Burst from center
- 20 particles
- Fall with gravity
- Fade out after 2s
```

---

## Accessibility

### Requirements

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | Minimum 4.5:1 for text, 3:1 for UI |
| Touch Targets | Minimum 44px × 44px |
| Focus Indicators | Visible ring on all interactive elements |
| Screen Reader | All images have alt text, all buttons have labels |
| Motion | Respect prefers-reduced-motion |

### Screen Reader Labels

```html
<button aria-label="Take photo of living room">
  <CameraIcon />
  Take Photo
</button>

<img alt="Living room photo showing window and furniture" />

<progress aria-label="Step 2 of 4: Property details" value="50" max="100">
```

---

## Error Handling Patterns

### Network Errors

```
┌─────────────────────────────────────┐
│                                     │
│         📡                          │
│                                     │
│    Connection lost                  │
│                                     │
│    Your progress is saved.          │
│    We'll reconnect automatically.   │
│                                     │
│    ┌─────────────────────────────┐  │
│    │      RETRY NOW              │  │
│    └─────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Validation Errors

```
INLINE VALIDATION:
┌─────────────────────────────────────┐
│  Built-up Area                      │
│  ┌─────────────────────────────┐    │
│  │  abc                        │    │
│  └─────────────────────────────┘    │
│  ⚠️ Please enter numbers only       │
└─────────────────────────────────────┘

AFTER CORRECTION:
┌─────────────────────────────────────┐
│  Built-up Area                      │
│  ┌─────────────────────────────┐    │
│  │  1,250          sq.ft.      │ ✓  │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

---

## Loading States

### Skeleton Screens

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │ ██████████████████████████  │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌───────────┐ ┌───────────┐        │
│  │ █████████ │ │ █████████ │        │
│  │ █████████ │ │ █████████ │        │
│  │ █████████ │ │ █████████ │        │
│  └───────────┘ └───────────┘        │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ████████████████████        │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Progress Indicators

```
UPLOADING PHOTOS:
┌─────────────────────────────────────┐
│                                     │
│    Uploading photos...              │
│                                     │
│    ████████████░░░░░░░░  60%       │
│                                     │
│    Photo 3 of 5                     │
│    Kitchen.jpg                      │
│                                     │
└─────────────────────────────────────┘
```

---

# Journey Metrics & Success Criteria

---

## Customer Journey KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to complete | <8 minutes | Analytics timestamp |
| Drop-off rate | <15% | Funnel analysis |
| Photo retake rate | <20% | QC rejection count |
| Support contacts | <5% | Support ticket tracking |
| NPS score | >60 | Post-completion survey |

## Valuer Dashboard KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Reviews per hour | >20 | Dashboard analytics |
| Average review time | <5 minutes | Time tracking |
| Follow-up rate | <15% | Status tracking |
| Accuracy rate | >95% | Audit sampling |
| Keyboard shortcut usage | >70% | Interaction logging |

---

## Conversion Funnels

### Customer Funnel

```
Welcome Screen
    │
    ├─ 95% ─→ OTP Entry
    │            │
    │            ├─ 92% ─→ Property Type
    │            │            │
    │            │            ├─ 98% ─→ Property Details
    │            │            │            │
    │            │            │            ├─ 96% ─→ Location Capture
    │            │            │            │            │
    │            │            │            │            ├─ 94% ─→ Photo Capture
    │            │            │            │            │            │
    │            │            │            │            │            └─ 90% ─→ SUBMITTED
    │            │            │            │            │
    │            │            │            │            └─ 4% GPS issues
    │            │            │            │
    │            │            │            └─ 2% form abandonment
    │            │            │
    │            │            └─ 2% confusion
    │            │
    │            └─ 3% OTP issues
    │
    └─ 5% drop-off (not interested)
```

---

# Appendix: Micro-Interactions

---

## Button Press Animation

```
1. User touches button
2. Scale down to 0.98 (50ms)
3. Shadow reduces (50ms)
4. On release: scale back to 1.0 (100ms)
5. If action: loading spinner appears
6. On complete: success checkmark (if applicable)
```

## Photo Capture Feedback

```
1. Shutter sound (optional, user preference)
2. Screen flash (white, 100ms)
3. Thumbnail appears in gallery strip
4. Checkmark overlay if quality OK
5. Warning overlay if quality issue
```

## Status Update Animation

```
1. Previous step fades out (200ms)
2. Connecting line draws (200ms)
3. New step icon scales in (200ms)
4. Text updates with typewriter effect (optional)
```

---

## Appendix: Device Testing Matrix

### Physical Device Testing

| Device Category | Devices to Test | Key Focus |
|----------------|-----------------|-----------|
| Budget Android | Redmi A series, Samsung M01 | Performance, touch response |
| Mid-range Android | Redmi Note series, Samsung F series | Primary user experience |
| Premium Android | OnePlus, Samsung S series | High-res displays |
| iPhone SE/11 | Older iOS devices | Older iOS compatibility |
| iPhone 12/13/14 | Current iOS | Primary iOS experience |
| iPad Mini | Tablet portrait | Compact tablet |
| iPad Air/Pro | Tablet landscape | Split view support |
| Windows Laptop | 13-15" screens | Browser testing |
| MacBook | 13-16" screens | Safari testing |

### Browser Testing

| Browser | Platform | Versions |
|---------|----------|----------|
| Chrome | Android | 90+ |
| Chrome | iOS | 90+ |
| Chrome | Desktop | 90+ |
| Safari | iOS | 14+ |
| Safari | macOS | 14+ |
| Firefox | Desktop | 90+ |
| Edge | Desktop | 90+ |

### Performance Targets

| Metric | Mobile | Tablet | Desktop |
|--------|--------|--------|--------|
| First Contentful Paint | <1.5s | <1.2s | <1s |
| Largest Contentful Paint | <2.5s | <2s | <1.5s |
| Time to Interactive | <3.5s | <3s | <2s |
| Cumulative Layout Shift | <0.1 | <0.1 | <0.1 |
| First Input Delay | <100ms | <100ms | <50ms |

---

## Appendix: Accessibility Across Devices

### WCAG 2.1 AA Compliance

| Requirement | Mobile | Tablet | Desktop |
|-------------|--------|--------|--------|
| Color Contrast 4.5:1 | ✓ Required | ✓ Required | ✓ Required |
| Focus Indicators | ✓ Visible | ✓ Visible | ✓ Visible |
| Touch Target 44x44px | ✓ Required | Recommended | N/A |
| Keyboard Navigation | N/A | Optional | ✓ Required |
| Screen Reader Support | ✓ Required | ✓ Required | ✓ Required |
| Text Scaling 200% | ✓ Test | ✓ Test | ✓ Test |

### Device-Specific Accessibility

```
MOBILE ACCESSIBILITY:
─────────────────────
• VoiceOver (iOS) / TalkBack (Android) support
• Dynamic Type support
• Reduce Motion respected
• Touch target minimum 44x44px
• High contrast mode support
• Bold Text support

TABLET ACCESSIBILITY:
────────────────────
• All mobile features
• Split view accessibility
• Pointer/cursor support
• Hover state alternatives
• Keyboard navigation

DESKTOP ACCESSIBILITY:
─────────────────────
• All tablet features
• Full keyboard navigation
• Focus trapping in modals
• Skip links
• ARIA live regions
```

---

*Document Version: 1.1*
*Created: February 14, 2026*
*Updated: February 14, 2026*
*For: Aditya Birla Capital — PropFlow MVP*
