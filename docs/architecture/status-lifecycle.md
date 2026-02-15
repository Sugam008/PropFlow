# Status Lifecycle: PropFlow

## State Transitions & Actions

| From State | To State | Triggering Action | Actor |
|------------|----------|-------------------|-------|
| - | **DRAFT** | `CREATE_PROPERTY` | Customer |
| **DRAFT** | **SUBMITTED** | `SUBMIT_VALUATION` | Customer |
| **SUBMITTED** | **UNDER_REVIEW** | `START_REVIEW` | Valuer |
| **UNDER_REVIEW** | **FOLLOW_UP_REQUIRED** | `REQUEST_CLARIFICATION` | Valuer |
| **FOLLOW_UP_REQUIRED** | **SUBMITTED** | `SUBMIT_FOLLOW_UP` | Customer |
| **UNDER_REVIEW** | **APPROVED** | `APPROVE` | Valuer |
| **UNDER_REVIEW** | **REJECTED** | `REJECT` | Valuer |

## Guardrails & Side Effects

### `SUBMIT_VALUATION`
- **Guard**: Must have at least one photo of each mandatory type (FRONT, INTERNAL).
- **Guard**: GPS coordinates must be captured.
- **Side Effect**: Lock property details for editing.

### `REQUEST_CLARIFICATION`
- **Side Effect**: Send push notification to Customer.
- **Side Effect**: Unlock specific fields or photo slots for re-submission.

### `APPROVE`
- **Guard**: Valuation amount must be > 0.
- **Side Effect**: Generate PDF report.
- **Side Effect**: Send notification to Customer.

### `REJECT`
- **Guard**: Rejection reason must be provided.
- **Side Effect**: Send notification to Customer.

## Fraud Status Lifecycle
Photos have an independent verification status:
- **PENDING**: Initial state after upload.
- **PASS**: GPS and EXIF validation successful.
- **FAIL**: GPS > 0.5km or EXIF suggests gallery/spoof.
