# PropFlow: Overall Design Principles
## Aditya Birla Capital Brand-Aligned Design Philosophy

---

## Document Overview

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 14, 2026 | Initial design principles |
| 1.1 | Feb 14, 2026 | Refined principles, added governance, expanded metrics |
| 1.2 | Feb 14, 2026 | Reviewed - fixed version footer inconsistency |

---

## Executive Summary

PropFlow embodies the Aditya Birla Capital brand essence: **"Money Simplified"** — transforming the complex, intimidating world of property valuation into an intuitive, trustworthy experience that every Indian can navigate with confidence.

The application serves as a bridge between traditional banking (physical valuations, paper-heavy processes) and modern digital expectations (instant, transparent, mobile-first). Our design must simultaneously:

1. **Build trust** — Customers need confidence their largest asset is being fairly valued
2. **Reduce friction** — Every unnecessary step is a barrier to completion
3. **Project competence** — This is a bank-grade financial product, not a consumer app
4. **Honor context** — India has 500M smartphone users on highly variable networks and devices

---

## Competitive Differentiation

### How We Beat Traditional Banks

| Traditional Banks | PropFlow | Design Implication |
|-------------------|----------|-------------------|
| Physical valuer visit required | Self-capture from phone | Guided photo experience must be foolproof |
| 3-7 day turnaround | 5-hour SLA | Real-time status updates, no black box |
| Paper-heavy forms | Digital-first | Smart defaults, auto-fill, minimal typing |
| Opaque process | Transparent | Show valuer name, explain every delay |
| One-size-fits-all | Personalized | Contextual help, smart suggestions |

### How We Beat Consumer Portals

| Property Portals | PropFlow | Design Implication |
|-----------------|----------|-------------------|
| Instant estimates only | Bank-grade valuation | Show confidence scores, comparable properties |
| No fraud prevention | GPS + EXIF + Camera-only | Visual trust indicators |
| No loan integration | Direct LAP workflow | Seamless continuation to application |
| Generic valuations | Specific to lending | Show why valuation matters for loan eligibility |

---

## User-Centered Design Philosophy

### The "Couch to Completion" Manifesto

PropFlow exists so someone can complete a property valuation from their couch in 8 minutes — without taking leave from work, without a stranger walking through their home, and without wondering what's happening.

**Our design commitment:**
- No installation required (PWA)
- Works on ₹8,000 phones
- Survives poor network conditions
- Respects user's time absolutely
- Makes the complex feel simple

### Aditya Birla Capital Brand Essence

| Element | Definition | PropFlow Interpretation |
|---------|------------|------------------------|
| **Brand Promise** | "Money Simplified" | "Property Valuation Simplified" |
| **Brand Position** | One brand for all your financial needs | One app for your property valuation |
| **Core Values** | Integrity, Commitment, Passion, Seamlessness, Speed | Honest valuations, committed service, passionate UX, seamless flow, 5-hour speed |
| **Brand Voice** | Warm, confident, clear, empowering | Friendly, trustworthy, simple, empowering |
| **Visual Character** | Premium, modern Indian, trustworthy | Premium fintech, distinctly Indian, bank-grade trust |

### The Four Pillars

PropFlow aligns with Aditya Birla Capital's four business verticals:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ADITYA BIRLA CAPITAL BRAND PILLARS                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐│
│    │  PROTECTING │    │  INVESTING  │    │  FINANCING  │    │  ADVISING   ││
│    │             │    │             │    │             │    │             ││
│    │  Insurance  │    │   Wealth    │    │    Loans    │    │  Guidance   ││
│    │             │    │             │    │             │    │             ││
│    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘│
│           │                  │                  │                  │       │
│           └──────────────────┴──────────────────┴──────────────────┘       │
│                                        │                                   │
│                              ┌─────────┴─────────┐                        │
│                              │                   │                        │
│                              │     PropFlow      │                        │
│                              │                   │                        │
│                              │  Property Lending │                        │
│                              │  Valuation System │                        │
│                              │                   │                        │
│                              └───────────────────┘                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Design Principles

### 1. Simplicity Over Complexity

**Principle**: Every interaction should feel obvious. If a user hesitates, we've failed.

```
BEFORE (Traditional Process):           AFTER (PropFlow):
────────────────────────────           ─────────────────────
1. Call bank                            1. Open app
2. Schedule valuer visit                2. Tap "Start"
3. Wait for confirmation                3. Follow guided photos
4. Take leave from work                 4. Submit
5. Wait for valuer (3-7 days)           5. Get valuation in 5 hours
6. Valuer visits, takes photos          
7. Wait for report (2-5 days)           
8. Follow up multiple times             
9. Finally get valuation                


STEPS REDUCED: 9 → 5
TIME REDUCED: 5-12 days → 5 hours
EFFORT REDUCED: Physical visit → Phone from couch
```

**Implementation Rules:**
- Maximum 4 screens per journey
- No more than 3 choices per screen
- Every button labeled with outcome, not action
- Progressive disclosure — show only what's needed now

---

### 2. Trust Through Transparency

**Principle**: Financial anxiety dissolves when users understand *why* something is happening.

```
TRUST-BUILDING MOMENTS:
──────────────────────

WHY do you need my location?
→ "To confirm you're at the property. This prevents fraud and speeds up approval."
→ Shows: ✓ Confirms property exists
         ✓ Prevents fraudulent submissions  
         ✓ Speeds up your approval

WHY do you need photos?
→ "Our valuers review these remotely, so you don't need to take time off work."
→ Shows: What valuers look for
         How long review takes
         What happens next

WHY 5 hours?
→ "Our valuers work in shifts, reviewing continuously. Most submissions are done within 4 hours."
```

**Implementation Rules:**
- Every permission request explains "why" before asking
- Real-time status updates (no black boxes)
- Show valuer name and photo when reviewing
- Explain every delay with cause and new ETA

---

### 3. Premium Feel, Indian Context

**Principle**: World-class design that feels distinctly Indian — not a Western import.

```
PREMIUM SIGNALS:                         INDIAN CONTEXT:
───────────────                         ─────────────────
• Generous white space                  • WhatsApp integration
• Subtle shadows, no flat              • Works on ₹8,000 phones
• Smooth animations (60fps)             • 2G network tolerance
• Micro-interactions on every action    • Regional language ready
• Haptic feedback                       • Indian Rupee formatting
• Typography hierarchy                  • Indian address formats
                                        • Festival-aware theming (optional)

```

**The Balance:**

| Western Premium | Indian Adaptation |
|----------------|-------------------|
| Sans-serif typography | Supports Devanagari, Tamil, etc. |
| Minimalist aesthetic | Rich but not cluttered |
| Cool color palette | Warmed with brand red |
| Abstract iconography | Literal + recognizable |
| Privacy-first design | Family-sharing features |

---

### 4. Speed as a Feature

**Principle**: Time is the scarcest resource. Every second saved is respect shown.

```
SPEED TARGETS:
──────────────

Customer App:
• App launch → First action: < 2 seconds
• Screen transitions: 300-400ms
• Photo capture → Preview: < 500ms
• Submission → Confirmation: < 2 seconds

Valuer Dashboard:
• Queue load: < 1 second
• Photo navigation: Instant (preloaded)
• Decision → Next property: < 500ms
• Full review cycle: < 5 minutes

System:
• Status update → Push notification: < 5 seconds
• WebSocket updates: Real-time
• Image optimization: Progressive load
```

---

### 5. Accessibility as Baseline

**Principle**: Financial inclusion means digital inclusion. Design for the edges.

```
ACCESSIBILITY CHECKLIST:
───────────────────────

Visual:
☐ Color contrast 4.5:1 minimum (WCAG AA)
☐ Don't rely on color alone to convey meaning
☐ Text resizable to 200% without loss
☐ Focus indicators on all interactive elements

Motor:
☐ Touch targets minimum 44x44px
☐ No gestures required (only optional)
☐ Works one-handed on mobile
☐ Large buttons, adequate spacing

Cognitive:
☐ Maximum 7 items in any list
☐ Consistent navigation patterns
☐ Clear error recovery paths
☐ Progress always visible

Auditory:
☐ All video has captions
☐ Audio guidance optional (not required)
☐ Visual alternatives for all sounds

Economic:
☐ Works on Android Go edition
☐ Functions on 2G networks
☐ Offline-capable for viewing status
☐ Data-efficient image compression
```

---

## Design Pillars in Detail

### Pillar 1: Intentional Friction

Friction is deliberately added where it prevents errors or fraud:

```
WHERE FRICTION IS GOOD:
─────────────────────

1. OTP Verification
   → Prevents unauthorized access
   → Friction: 6-digit code entry
   → Justification: "This keeps your data safe"

2. Photo Quality Confirmation
   → Prevents unusable submissions
   → Friction: Review screen before submit
   → Justification: "Make sure your photos are clear"

3. Location Capture
   → Prevents fraudulent submissions
   → Friction: GPS verification
   → Justification: "Confirms you're at the property"

WHERE FRICTION IS BAD:
──────────────────────

✗ Re-entering information
✗ Multiple confirmation screens
✗ Long legal disclaimers to read
✗ Unclear next steps
✗ Waiting without feedback
```

### Pillar 2: Progressive Disclosure

Show complexity only when needed:

```
PROGRESSIVE DISCLOSION MAP:
──────────────────────────

STEP 1: Property Type
        Shows: 4 property types
        Hides: All other details

STEP 2: Property Details
        Shows: BHK, Area, Age, Floor
        Hides: Location, Photos

STEP 3: Location
        Shows: Map, Address
        Hides: Photo requirements

STEP 4: Photos
        Shows: Current photo guidance
        Hides: Other photo types

REVIEW: Summary
         Shows: Everything captured
         Hides: Technical metadata

NEVER SHOWN TO CUSTOMER:
→ EXIF data
→ GPS coordinates (as numbers)
→ Server timestamps
→ Internal reference codes (until submission)
```

### Pillar 3: Emotional Design

Every screen should evoke a specific emotional response:

```
EMOTIONAL JOURNEY MAP:
──────────────────────

SCREEN              EMOTION               DESIGN TECHNIQUE
─────────────────────────────────────────────────────────
Welcome             Curiosity + Trust     Clean hero, social proof
OTP                 Security              Bank-like styling
Property Type       Confidence            Clear choices, no wrong answer
Property Details    Competence            Smart defaults, easy inputs
Location            Transparency          Map visible, "why" explained
Photo Capture       Guidance + Calm       Overlays, audio hints, feedback
Review              Control               Can retake, no pressure
Submission          Relief                Success animation, clear next steps
Tracking            Patience              Real progress, ETA
Complete            Joy + Achievement     Celebration, clear value shown

```

### Pillar 4: Consistent Yet Contextual

Same brand, adapted to context:

```
BRAND CONSISTENCY:
─────────────────

Always Present:
• ABC Red (#E31E24) as primary accent
• Sun motif in loading states
• "A Force for Good" tone
• Premium typography treatment

CONTEXTUALLY ADAPTED:
────────────────────

Customer App:
• Warm, friendly language
• Encouraging microcopy
• Celebratory success states

Valuer Dashboard:
• Professional, efficient tone
• Keyboard-first design
• Data-dense but organized

Error States:
• Helpful, not blaming
• Specific recovery actions
• Never use "Error" in messages
```

---

## Design Ethics

### Data Ethics

```
PRINCIPLES:
──────────

1. Minimal Collection
   → Only collect what's needed for valuation
   → No behavioral tracking
   → No marketing data collection

2. Transparent Use
   → Every data point has visible purpose
   → Users can see what we have
   → Easy to request deletion

3. Secure by Default
   → Encryption at rest and in transit
   → EXIF data stripped of unnecessary metadata
   → Audit trails for all access

4. User Control
   → Can pause process anytime
   → Can delete submission before review
   → Can export their data
```

### Inclusive Design

```
CONSIDERATIONS:
──────────────

Language:
• Hindi + 10 regional languages
• Simple language (Class 8 reading level)
• No jargon without explanation

Device:
• Works on Android 7+
• Works on iPhone iOS 13+
• Works on 2GB RAM devices
• Works on 5.5" to 7" screens

Network:
• Functions on 3G
• Image compression for slow networks
• Offline viewing of submitted data

Ability:
• Screen reader compatible
• Voice input for text fields
• High contrast mode support
• Large text support

Economic:
• No premium tier needed
• Full functionality for all users
• No paywalls or upsells in core flow
```

---

## Quality Standards

### Code Quality

```
STANDARDS:
─────────

Performance:
• First Contentful Paint: < 1.5s
• Largest Contentful Paint: < 2.5s
• Cumulative Layout Shift: < 0.1
• First Input Delay: < 100ms

Accessibility:
• WCAG 2.1 AA compliance
• Automated testing + manual verification
• Screen reader testing on VoiceOver, TalkBack

Browser Support:
• Chrome 90+
• Safari 14+
• Firefox 90+
• Edge 90+
• Samsung Internet 14+

Mobile Support:
• iOS 13+
• Android 7+
• Responsive 320px - 2560px
```

### Design Quality

```
REVIEW CHECKLIST:
─────────────────

Before Any Design Ships:
☐ Meets brand guidelines
☐ Responsive across breakpoints
☐ Accessibility tested
☐ Error states designed
☐ Empty states designed
☐ Loading states designed
☐ Micro-interactions specified
☐ Copy reviewed for clarity
☐ Animation timing specified
☐ Touch targets verified
☐ Color contrast verified
☐ Keyboard navigation works (desktop)
☐ Focus states designed
☐ Dark mode compatible (future)
```

---

## Governance

### Design Decisions

```
DECISION FRAMEWORK:
───────────────────

When in doubt, ask:

1. Does it simplify the user's life?
   → Yes: Proceed
   → No: Reconsider

2. Does it build trust?
   → Yes: Proceed
   → No: Reconsider

3. Does it work for the slowest device?
   → Yes: Proceed
   → No: Simplify

4. Does it align with ABC brand?
   → Yes: Proceed
   → No: Align first

5. Can a first-time user understand it?
   → Yes: Proceed
   → No: Clarify

ESCALATION:
──────────
If principles conflict:
1. Simplicity > Aesthetics
2. Accessibility > Innovation
3. Trust > Conversion
4. User need > Business want
5. Long-term value > Short-term metric
```

### Design Review Process

```
WORKFLOW:
─────────

1. Concept Review
   → Principles alignment check
   → User need validation

2. Visual Design Review
   → Brand guidelines check
   → Accessibility check
   → Responsive design check

3. Prototype Review
   → Usability testing
   → Edge case handling
   → Error flow validation

4. Implementation Review
   → Design system compliance
   → Performance impact
   → Accessibility audit

5. Post-Launch Review
   → Analytics validation
   → User feedback analysis
   → Iteration planning
```

---

## Success Metrics

### Design-Led KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to complete (customer) | < 8 minutes | Analytics |
| Screens per session | 4-5 average | Analytics |
| Help requests | < 5% of users | Support tickets |
| NPS Score | > 60 | Survey |
| Perceived ease | 9/10 | Post-completion survey |
| Brand perception lift | +15% | Brand tracker |

### Technical KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| App size | < 25MB | Build output |
| Load time on 3G | < 3s | Field testing |
| Crash rate | < 0.1% | Crashlytics |
| Accessibility score | 100 | Lighthouse |
| Performance score | > 90 | Lighthouse |

---

## Appendix: Design Inspiration

### Brands We Admire

| Brand | What We Learn |
|-------|---------------|
| **Stripe** | Developer-focused simplicity, clear documentation |
| **Airbnb** | Trust-building through transparency, beautiful forms |
| **WhatsApp** | Simplicity, universal accessibility, low-barrier entry |
| **Apple** | Premium feel through restraint, thoughtful animations |
| **Zerodha** | Indian fintech done right, no-nonsense approach |
| **Google Pay** | Indian context, regional languages, simple flows |

### Design Systems We Reference

| System | What We Borrow |
|--------|---------------|
| **Material Design** | Component patterns, motion principles |
| **Apple HIG** | Touch targets, typography scaling |
| **Carbon Design** | Data-dense patterns (for valuer dashboard) |
| **Polaris** | Accessibility patterns, form design |
| **ABC Design System** | Brand-aligned colors, typography, components |

---

*Document Version: 1.1*
*Created: February 14, 2026*
*For: Aditya Birla Capital — PropFlow MVP*