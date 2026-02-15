# Design Contracts

This document covers UI component contracts, state management standards, and accessibility requirements.

## Component Contracts

### Badge Component

**Location**: `packages/ui/src/components/Badge.tsx`

```typescript
interface BadgeProps {
  variant: 'pending' | 'review' | 'approved' | 'follow-up' | 'rejected';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

| State     | Visual                       |
| --------- | ---------------------------- |
| pending   | Yellow background, dark text |
| review    | Blue background, dark text   |
| approved  | Green background, dark text  |
| follow-up | Orange background, dark text |
| rejected  | Red background, white text   |

### Button Component

**Location**: `packages/ui/src/components/Button.tsx`

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
}
```

### Input Component

**Location**: `packages/ui/src/components/Input.tsx`

```typescript
interface InputProps {
  type?: 'text' | 'number' | 'password';
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}
```

---

## State Management Standards

### State Classification

| Category        | Description                       | Tool                  |
| --------------- | --------------------------------- | --------------------- |
| Server State    | API data (properties, valuations) | TanStack Query        |
| Global UI State | Auth, theme, notifications        | Zustand               |
| Local UI State  | Component-level (dropdowns, tabs) | React useState        |
| Form State      | Inputs, validation, submission    | React Hook Form + Zod |
| URL State       | Filters, search, pagination       | Next.js Router        |

### TanStack Query Standards

- **Query Keys**: Centralized factory for consistency
- **Stale Time**: 5 minutes default, 0 for dynamic data
- **Mutations**: Optimistic updates or cache invalidation
- **Errors**: Global error boundaries with toast notifications

### Zustand Standards

- **Atomic Stores**: Small, focused stores (`useAuthStore`, `useConfigStore`)
- **Actions**: Defined within store for predictable transitions
- **Persistence**: `persist` middleware for refresh survival

---

## Accessibility Standards

**Target: WCAG 2.1 Level AA**

### Interaction

| Requirement    | Standard                                 |
| -------------- | ---------------------------------------- |
| Touch targets  | Minimum 44x44 points                     |
| Target spacing | At least 8px between targets             |
| Focus states   | Visible ring/border indicator            |
| Keyboard nav   | All functionality reachable via keyboard |

### Visual

| Requirement   | Standard                      |
| ------------- | ----------------------------- |
| Text contrast | 4.5:1 (normal), 3:1 (large)   |
| UI contrast   | 3:1 for borders, icons, focus |
| Font scaling  | Support up to 200%            |

### ARIA

- Use `aria-label` when visual label missing
- Use `aria-live` for dynamic updates
- Use `aria-expanded` for collapsibles
- All images need `alt` attribute
- Errors identified by text, not just color

### Component A11y

| Component | Requirement                                  |
| --------- | -------------------------------------------- |
| Button    | Label required; icon-only needs `aria-label` |
| Input     | Visible `<label>` or `aria-labelledby`       |
| Card      | Clickable card = `<a>` or appropriate role   |
| Modal     | Focus trap, close on `Esc`                   |

---

## Screen State Definitions

### Customer App: Login Screen

| State   | Behavior                                 |
| ------- | ---------------------------------------- |
| Initial | Phone input empty, Get OTP disabled      |
| Typing  | Validate phone format, enable when valid |
| Loading | Spinner on button, disable input         |
| Success | Navigate to OTP verification             |
| Error   | Toast "Unable to send OTP", retry button |

### Customer App: OTP Verification

| State    | Behavior                                               |
| -------- | ------------------------------------------------------ |
| Initial  | 6 empty boxes, auto-focus first, resend disabled (30s) |
| Typing   | Auto-advance, backspace moves back                     |
| Complete | All 6 filled, auto-submit                              |
| Success  | Store token, navigate to main                          |
| Error    | Shake animation, "Invalid OTP" message                 |

### Customer App: Photo Capture

| State     | Behavior                              |
| --------- | ------------------------------------- |
| Initial   | Camera preview, capture button        |
| Capturing | Shutter animation                     |
| Captured  | Preview image, retake/confirm buttons |
| QC Fail   | Error message, retake prompt          |
| Success   | Photo saved, return to review         |

---

## Verification Checklist

- [ ] axe-core automated scan pass
- [ ] Screen reader (VoiceOver/TalkBack) walkthrough
- [ ] Keyboard-only navigation pass
- [ ] Contrast ratio audit for brand colors
- [ ] Server data cached and revalidated
- [ ] Form validations match backend schemas
- [ ] URL reflects view state (filters/search)
