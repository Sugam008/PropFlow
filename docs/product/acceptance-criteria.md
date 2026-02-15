# Acceptance Criteria: PropFlow

## Customer App Flow
### S1: Welcome Screen
- Screen displays logo and brief value proposition.
- "Get Started" button navigates to OTP screen.
### S2: OTP Authentication
- User can enter mobile number.
- System sends 6-digit OTP.
- User can enter OTP.
- System validates OTP and redirects to Home/Property selection.
### S5: GPS Capture
- App requests location permissions with explanation.
- System captures GPS coordinates at time of photo capture.
- System validates GPS is within 0.5km of property address (if known).

## Valuer Workflow
### V1: Queue Management
- Dashboard displays list of submissions with status SUBMITTED.
- List shows: Submission ID, Date, Property Type, Address.
- Clicking a row opens V2 Review Screen.
### V2: Review & Decision
- Split-screen view: Left (Property Details/Photos), Right (Decision Controls).
- Photos display EXIF validation status (PASS/FAIL).

## Fraud Prevention
### Camera-only Capture
- "Take Photo" button opens native camera only.
- No option to select from gallery.
- Captured image is stored in app private storage, not public gallery.
### GPS Validation
- Verification fails if GPS is disabled.
- Verification fails if GPS coordinates are > 0.5km from target.
- Verification fails if metadata suggests spoofing.

## Performance & Quality (Hard Constraints)
- API p95 latency < 500ms.
- WCAG 2.1 AA compliance (contrast, touch targets 44x44px).
- App size < 25MB.
- Customer completion time < 8 minutes.
