# State Machine: PropFlow Valuation Lifecycle

## Status Definitions
- **DRAFT**: Initial state while user is filling out details in mobile app.
- **SUBMITTED**: User has completed all steps and clicked submit.
- **UNDER_REVIEW**: Valuer has opened the submission for review.
- **FOLLOW_UP_REQUIRED**: Valuer has requested more info/photos from the customer.
- **APPROVED**: Valuer has provided a valuation and approved the case.
- **REJECTED**: Valuer has rejected the case (e.g., fraud, poor quality).

## Transitions
- `DRAFT` → `SUBMITTED`: User triggers `SUBMIT_VALUATION`.
- `SUBMITTED` → `UNDER_REVIEW`: Valuer triggers `START_REVIEW`.
- `UNDER_REVIEW` → `FOLLOW_UP_REQUIRED`: Valuer triggers `REQUEST_CLARIFICATION`.
- `FOLLOW_UP_REQUIRED` → `SUBMITTED`: User triggers `SUBMIT_FOLLOW_UP`.
- `UNDER_REVIEW` → `APPROVED`: Valuer triggers `APPROVE` (with amount).
- `UNDER_REVIEW` → `REJECTED`: Valuer triggers `REJECT` (with reason).

## Error States
- **SUBMISSION_FAILED**: Network or server error during submit.
- **VERIFICATION_FAILED**: Fraud detection (GPS/EXIF) failed on backend.
- **AUTH_FAILED**: OTP or session expired.
