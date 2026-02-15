# Risk Register: PropFlow

## Active Risks

| ID | Risk Description | Impact | Probability | Mitigation Strategy | Status |
|----|------------------|--------|-------------|---------------------|--------|
| R-001 | GPS Spoofing / Mock Locations | High | Medium | Implement multi-factor verification (EXIF + GPS + Signal strength if available). | Open |
| R-002 | Large Photo Upload Latency on 3G | Medium | High | Implement client-side compression and background upload. | Open |
| R-003 | Divergent UI between Mobile & Web | Low | Medium | Use shared theme tokens and core component library in `frontend/packages`. | Open |
| R-004 | Delay in Valuer Feedback Loop | High | Low | Implement real-time WebSocket notifications and SLA tracking. | Open |

## Risk Level Definition
- **High Impact**: Prevents core business value (valuation).
- **Medium Impact**: Degrades user experience or efficiency.
- **Low Impact**: Minor inconvenience.
