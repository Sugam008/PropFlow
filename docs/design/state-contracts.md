# UX State Contracts

Complete state definitions for all MVP screens in PropFlow.

## Customer Mobile App

### Screen: Login

#### States

**Initial**

- Phone input empty
- Get OTP button disabled
- Keyboard: number-pad

**Typing**

- Validate phone format
- Enable button when valid (+91 or 10 digits)

**Loading (Sending OTP)**

- Show spinner on button
- Disable input
- "Sending OTP..." text

**Success**

- Navigate to OTP verification
- Pass phone number

**Error**

- Show error toast
- "Unable to send OTP. Please try again."
- Retry button

---

### Screen: OTP Verification

#### States

**Initial**

- 6 empty digit boxes
- Auto-focus first box
- Resend disabled (30s countdown)

**Typing**

- Auto-advance to next box
- Backspace moves back
- Validate each digit (0-9)

**Complete**

- All 6 digits filled
- Auto-submit
- Show loading state

**Loading**

- Full screen overlay
- "Verifying..."

**Success**

- New user: Navigate to onboarding
- Existing user: Navigate to home

**Error**

- "Invalid OTP" under input
- Clear inputs
- Focus first box
- Shake animation

**Expired**

- "OTP expired" message
- Enable resend button

---

### Screen: Property List

#### States

**Loading (Initial)**

- Show 3 skeleton cards
- Navigation bar visible

**Empty**

- Illustration: Empty state
- Headline: "No properties yet"
- CTA: "Add your first property"

**Error**

- "Unable to load properties"
- Retry button
- Pull-to-refresh enabled

**Success**

- List of property cards
- Pull-to-refresh
- Scroll pagination (lazy load)

**Refreshing**

- Pull indicator
- Maintain current list

---

### Screen: Property Detail

#### States

**Loading**

- Skeleton for header image
- Skeleton for details
- Back button visible

**Success**

- Property photos carousel
- All details displayed
- Status badge
- Action buttons based on status

**Error**

- "Property not found"
- Back to list button

**Photo Gallery**

- Full-screen modal
- Swipe between photos
- Pinch to zoom

---

### Screen: Photo Capture

#### States

**Permission Check**

- Request camera permission
- Explain why needed

**Camera Ready**

- Live preview
- Capture button
- Guidelines overlay
- Flash toggle

**Capturing**

- Shutter animation
- Brief freeze

**Preview**

- Show captured photo
- Retake or Confirm
- EXIF validation running

**Validating**

- "Checking photo quality..."
- QC indicators (blur, brightness, GPS)

**QC Failed**

- Show issues (blur/dark/glare)
- "Retake recommended"
- Force retake for critical issues

**Success**

- Photo added to list
- Continue or add more

---

### Screen: Property Submission

#### States

**Draft**

- Partial form data
- "Save as draft" available
- Validation on fields

**Validating**

- Check required fields
- Show field errors

**Ready**

- All required fields filled
- Submit button enabled
- "Submit for valuation"

**Submitting**

- Full screen loading
- "Uploading photos..."
- Progress bar per photo

**Success**

- Success animation
- Reference number
- "Expected in 5 hours"
- Track button

**Error**

- "Submission failed"
- Retry option
- Preserve form data

---

## Valuer Dashboard

### Screen: Property Queue

#### States

**Loading**

- Skeleton table rows
- Filter tabs visible

**Empty**

- "No properties in queue"
- Based on active filter

**Filter Active**

- Show active filter pills
- Clear all option
- Results count

**Success**

- Table with properties
- Sortable columns
- Row hover states
- Click to view

**Error**

- "Failed to load queue"
- Retry button

---

### Screen: Property Review

#### States

**Loading**

- Split view loading
- Left: Skeleton details
- Right: Skeleton photos

**Success**

- Full property details
- Photo gallery
- Comparable properties
- Valuation form

**Valuing**

- Form active
- Calculate button
- Auto-save draft

**Submitting Valuation**

- "Saving..."
- Disable form

**Success**

- Confirmation modal
- Return to queue
- Queue auto-updates

**Request Follow-up**

- Form for additional info
- Select required photos
- Submit to customer

---

## Copy Tone Guidelines

### Voice Characteristics

- **Clear**: Simple words, no jargon
- **Helpful**: Anticipate user needs
- **Trustworthy**: Professional, accurate
- **Friendly**: Warm but not casual

### Do's

- "Your property has been submitted"
- "We'll notify you within 5 hours"
- "Photo is blurry - please retake"
- "Estimated value: ₹72,00,000"

### Don'ts

- "Property submitted successfully"
- "You will be notified"
- "Image quality insufficient"
- "EV: 72L"

---

## Microinteraction Timings

| Animation         | Duration | Easing                                  |
| ----------------- | -------- | --------------------------------------- |
| Button press      | 100ms    | ease-out                                |
| Modal open        | 200ms    | cubic-bezier(0.4, 0, 0.2, 1)            |
| Toast enter       | 300ms    | cubic-bezier(0.68, -0.55, 0.265, 1.55)  |
| Toast exit        | 150ms    | ease-in                                 |
| Page transition   | 300ms    | ease-in-out                             |
| Skeleton shimmer  | 1500ms   | linear                                  |
| Loading spinner   | 800ms    | linear (infinite)                       |
| Success checkmark | 400ms    | cubic-bezier(0.175, 0.885, 0.32, 1.275) |

---

## Error State Guidelines

### Copy Structure

1. **What happened**: Clear statement
2. **Why it matters**: Brief explanation
3. **What to do**: Actionable next step

### Examples

| Error             | Copy                                                           |
| ----------------- | -------------------------------------------------------------- |
| Network failure   | "Connection lost. Please check your internet and try again."   |
| Photo upload fail | "Unable to upload photo. Tap to retry."                        |
| Invalid OTP       | "Incorrect code. Please try again."                            |
| Session expired   | "Your session has expired. Please log in again."               |
| Server error      | "Something went wrong. We're working on it. Please try again." |

---

## Accessibility States

### Focus Management

- Trap focus in modals
- Return focus after modal close
- Skip to main content link

### Screen Reader

- Announce page changes
- Describe images
- Read form errors
- State loading status

### Reduced Motion

- Disable animations
- Instant state changes
- Static loading indicators
