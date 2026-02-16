# Security Hardening Documentation

Comprehensive security review and hardening for PropFlow.

## Authentication & Authorization

### JWT Configuration

- **Access Token Expiry**: 15 minutes
- **Refresh Token**: HTTP-only cookie, 7 days expiry
- **Algorithm**: HS256 (minimum)
- **Secret Rotation**: Quarterly rotation policy

### Rate Limiting

```python
# Applied to all auth endpoints
- Login attempts: 5 per minute per IP
- OTP requests: 3 per 5 minutes per phone
- API general: 100 per minute per user
```

### Implementation

```python
# backend/app/core/rate_limit.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/auth/login/otp")
@limiter.limit("5/minute")
async def request_otp(...)
```

## Input Validation

### Pydantic Schemas

All inputs validated via Pydantic models:

- Type checking
- Length limits
- Regex patterns for phone, email
- Range validation for numeric fields

### SQL Injection Prevention

- SQLAlchemy ORM used exclusively
- No raw SQL queries
- Parameterized queries only

### XSS Prevention

- Output encoding in templates
- Content Security Policy headers
- React/Next.js auto-escaping

## File Upload Security

### EXIF Validation

```python
# backend/app/services/image_service.py
def validate_exif(image_data: bytes) -> dict:
    """
    Validates photo metadata:
    - Timestamp within 30 minutes
    - GPS coordinates within 0.5km
    - Device model matches expected
    - No screenshot software signatures
    """
```

### Upload Restrictions

- Max file size: 10MB
- Allowed types: JPEG, PNG only
- Virus scanning: ClamAV integration
- Filename sanitization

### Fraud Prevention

- **Gallery Detection**: Camera-only enforcement via HTML5 Media Capture (capture="environment")
- **Screenshot Detection**: EXIF analysis for screenshot signatures
- **GPS Spoofing**: Validation against property coordinates
- **Replay Attack**: Timestamp validation prevents old photo reuse

## Data Protection

### Encryption

- **In Transit**: TLS 1.3 minimum
- **At Rest**:
  - PostgreSQL: AES-256 encryption
  - S3: Server-side encryption (SSE-S3)
  - Redis: TLS encryption

### PII Handling

**Collected PII**:

- Phone numbers (hashed in logs)
- Email addresses
- Property addresses
- GPS coordinates (fuzzy for public)

**PII Protection**:

- Encryption at rest
- Access logging
- Data retention: 7 years (compliance)
- Deletion workflow available

### Secrets Management

```bash
# Environment variables only
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=<generated-secret>
AWS_ACCESS_KEY_ID=<access-key>
TWILIO_AUTH_TOKEN=<auth-token>
```

No secrets in:

- Git repository
- Docker images
- Client-side code

## CORS Configuration

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://propflow.adityabirla.com",
        "https://admin.propflow.adityabirla.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

## Security Headers

```python
# Applied via middleware
{
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'",
}
```

## Audit Logging

All security events logged:

- Login attempts (success/failure)
- Token refresh
- Permission denied
- Data access (read sensitive fields)
- File uploads
- Admin actions

```python
# backend/app/services/audit_service.py
class AuditService:
    async def log_security_event(
        self,
        event_type: str,
        user_id: str,
        details: dict,
        ip_address: str
    ):
        """Immutable audit trail for compliance"""
```

## Dependency Audit

### Automated Checks

```bash
# Python
pip-audit --desc --format=json > security/python-audit.json

# Node.js
npm audit --json > security/npm-audit.json
pnpm audit --json > security/pnpm-audit.json
```

### Critical/High Severity Response

1. Immediate assessment of impact
2. Patch within 24 hours (critical)
3. Patch within 7 days (high)
4. Document exceptions with risk acceptance

## Penetration Testing

### Automated Scans

- OWASP ZAP baseline scan on CI
- Snyk container scanning
- GitHub Dependabot alerts

### Manual Testing

- Quarterly third-party penetration test
- Focus areas:
  - Authentication bypass
  - Authorization escalation
  - SQL injection
  - XSS vectors
  - File upload abuse

## Incident Response

### Security Incident Levels

**Level 1 (Critical)**: Data breach, system compromise

- Response: Immediate
- Notification: Within 1 hour

**Level 2 (High)**: Vulnerability exploitation attempt

- Response: Within 4 hours
- Investigation: Within 24 hours

**Level 3 (Medium)**: Policy violation, suspicious activity

- Response: Within 24 hours
- Investigation: Within 72 hours

### Response Team

- Security Lead
- Engineering Lead
- Legal/Compliance
- Communications

## Compliance

### Data Protection

- **GDPR**: User data deletion workflow
- **PDPA**: India personal data protection
- **ISO 27001**: Information security management

### Financial Services

- **RBI Guidelines**: Digital lending compliance
- **PCI DSS**: If payment processing added

## Security Checklist

### Pre-Deployment

- [ ] All dependencies audited
- [ ] No secrets in codebase
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Security headers set
- [ ] TLS configured
- [ ] Logging enabled
- [ ] Backup tested

### Post-Deployment

- [ ] SSL Labs A+ rating
- [ ] Security headers validated
- [ ] WAF rules active
- [ ] Monitoring alerts configured
- [ ] Incident response tested

## Sign-off

**Security Review Completed**:

- [ ] Authentication hardened
- [ ] Authorization verified
- [ ] Input validation complete
- [ ] File upload secured
- [ ] Data encrypted
- [ ] Audit logging active
- [ ] Dependencies audited
- [ ] Penetration test passed

**Approved By**: **\*\***\_\_\_**\*\*** Date: \***\*\_\_\_\*\***
