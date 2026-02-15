# PropFlow Accessibility (a11y) Contracts

Target: **WCAG 2.1 Level AA**

## 1. Interaction Standards

### Touch Targets (Mobile Focus)
- All interactive elements must have a minimum touch target size of **44x44 points**.
- Spacing between targets should be at least **8px** to prevent accidental triggers.

### Focus States
- Interactive elements must have a highly visible focus indicator (ring or border).
- Use `colors.primary[500]` or a high-contrast equivalent for focus outlines.
- Never use `outline: none` without providing a custom focus style.

### Keyboard Navigation (Dashboard Focus)
- Logical tab order must follow the visual flow (top-to-bottom, left-to-right).
- All functionality must be reachable via keyboard.
- Use semantic HTML tags (`<button>`, `<a>`, `<input>`) to leverage native keyboard behavior.

## 2. Visual Standards

### Color Contrast
- **Text**: Minimum contrast ratio of **4.5:1** for normal text and **3:1** for large text.
- **UI Components**: Minimum contrast ratio of **3:1** for borders, icons, and focus states.
- Verification Tool: Use Axe or similar for automated audits.

### Text & Scaling
- Support font scaling up to **200%** without loss of content or functionality.
- Use relative units (rem/em) or responsive layout patterns to accommodate larger text sizes.

## 3. Semantic & Content Standards

### ARIA Implementation
- Use `aria-label` when the visual label is missing or insufficient.
- Use `aria-live` for dynamic status updates (e.g., "Submission successful").
- Use `aria-expanded` for collapsibles and dropdowns.

### Alternative Text
- Every image must have an `alt` attribute.
- Decorative images should have `alt=""` (empty) to be ignored by screen readers.
- Functional images (icons acting as buttons) must have descriptive alt text or `aria-label`.

### Error Handling
- Errors must be identified via text, not just color (e.g., add an "Error:" prefix or icon).
- Associate error messages with their respective inputs using `aria-describedby`.

## 4. Component Implementation Guide

| Component | A11y Requirement |
| :--- | :--- |
| **Button** | Must have a label; if icon-only, use `aria-label`. |
| **Input** | Must have a visible `<label>` or `aria-labelledby`. |
| **Card** | If the entire card is clickable, use a single `<a>` or appropriate role. |
| **Modal** | Must trap focus within the modal and close on `Esc`. |

## 5. Verification Checklist

- [ ] axe-core automated scan pass.
- [ ] Manual screen reader (VoiceOver/TalkBack) walkthrough.
- [ ] Keyboard-only navigation pass.
- [ ] Contrast ratio audit for all brand colors.
