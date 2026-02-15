# Component Contracts

Canonical contracts for all UI components in PropFlow design system.

## Badge Component

**Location**: `packages/ui/src/components/Badge.tsx`

### Props Interface

```typescript
interface BadgeProps {
  variant: 'pending' | 'review' | 'approved' | 'follow-up' | 'rejected';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

### Accessibility

- Uses semantic colors with 4.5:1 contrast ratio
- Includes aria-label for status meaning
- Focusable when interactive

### States

| State     | Visual                       |
| --------- | ---------------------------- |
| pending   | Yellow background, dark text |
| review    | Blue background, dark text   |
| approved  | Green background, dark text  |
| follow-up | Orange background, dark text |
| rejected  | Red background, white text   |

---

## Button Component

**Location**: `packages/ui/src/components/Button.tsx`

### Props Interface

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

### Accessibility

- Minimum touch target: 44x44px
- Focus ring: 2px offset, primary color
- Loading state: aria-busy="true"
- Disabled state: aria-disabled="true"

### States

| State    | Visual                    |
| -------- | ------------------------- |
| default  | Primary color fill        |
| hover    | Darker shade (600)        |
| active   | Darker shade (700)        |
| loading  | Spinner + reduced opacity |
| disabled | Gray, not interactive     |

---

## Card Component

**Location**: `packages/ui/src/components/Card.tsx`

### Props Interface

```typescript
interface CardProps {
  children: React.ReactNode;
  interactive?: boolean;
  selected?: boolean;
  onPress?: () => void;
}
```

### Accessibility

- role="button" when interactive
- aria-pressed when selectable
- Focus ring on interactive cards

### States

| State    | Visual                                 |
| -------- | -------------------------------------- |
| default  | White background, subtle shadow        |
| hover    | Elevated shadow                        |
| selected | Primary border, subtle background tint |
| disabled | Reduced opacity                        |

---

## Input Component

**Location**: `packages/ui/src/components/Input.tsx`

### Props Interface

```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'email-address';
}
```

### Accessibility

- Label associated with input (aria-labelledby)
- Error announced via aria-live="polite"
- Focus ring: primary color

### States

| State    | Visual                        |
| -------- | ----------------------------- |
| default  | Gray border                   |
| focus    | Primary border, shadow        |
| error    | Red border, error message     |
| success  | Green border, check icon      |
| disabled | Gray background, not editable |

---

## Modal Component

**Location**: `packages/ui/src/components/Modal.tsx`

### Props Interface

```typescript
interface ModalProps {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: Array<{
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}
```

### Accessibility

- role="dialog"
- aria-modal="true"
- Focus trap inside modal
- Close on Escape key
- Backdrop click to close

### States

| State    | Behavior                 |
| -------- | ------------------------ |
| open     | Fade in, scale up        |
| closing  | Fade out, scale down     |
| backdrop | Semi-transparent overlay |

---

## OTPInput Component

**Location**: `packages/ui/src/components/OTPInput.tsx`

### Props Interface

```typescript
interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  error?: string;
  disabled?: boolean;
}
```

### Accessibility

- Each digit in separate input (aria-label="Digit 1 of 6")
- Auto-focus next field on input
- Backspace moves to previous field
- Paste support for full OTP

### Behavior

- 6 digits by default
- Numeric keyboard
- Auto-submit when complete
- Visual feedback on complete

---

## Progress Component

**Location**: `packages/ui/src/components/Progress.tsx`

### Props Interface

```typescript
interface ProgressProps {
  value: number; // 0-100
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
}
```

### Accessibility

- role="progressbar"
- aria-valuenow, aria-valuemin, aria-valuemax
- aria-label for context

### Variants

| Variant  | Use Case                               |
| -------- | -------------------------------------- |
| linear   | Form progress, loading bars            |
| circular | Upload progress, completion indicators |

---

## Skeleton Component

**Location**: `packages/ui/src/components/Skeleton.tsx`

### Props Interface

```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
}
```

### Accessibility

- aria-busy="true" on parent container
- aria-label="Loading..."
- Reduced motion support

### Animation

- Default: shimmer gradient animation
- prefers-reduced-motion: static gray

---

## Toast Component

**Location**: `packages/ui/src/components/Toast.tsx`

### Props Interface

```typescript
interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}
```

### Accessibility

- role="alert"
- aria-live="polite"
- Auto-dismiss with timeout
- Swipe to dismiss (mobile)

### States

| Type    | Color  |
| ------- | ------ |
| success | Green  |
| error   | Red    |
| warning | Yellow |
| info    | Blue   |

---

## Design Principles

### Touch Targets

- Minimum: 44x44px (WCAG 2.1)
- Preferred: 48x48px
- Spacing between targets: 8px minimum

### Animation

- Duration: 150-300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- prefers-reduced-motion: respect user preference

### Color Contrast

- Text on backgrounds: 4.5:1 minimum (AA)
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Focus States

- Visible focus ring on all interactive elements
- 2px offset from element
- Primary brand color for ring

---

## Responsive Behavior

### Mobile (< 768px)

- Full-width buttons
- Touch-optimized spacing
- Bottom sheet modals

### Desktop (>= 768px)

- Max-width containers
- Hover states enabled
- Centered modals
