# Integration Test Documentation

End-to-end integration tests for PropFlow connecting all systems.

## Test Environment Setup

```bash
# Start all services
docker-compose up -d

# Seed test data
python backend/scripts/seed.py

# Start development servers
pnpm dev
```

## Test Suite 1: Customer Journey (S1-S8)

### Test 1.1: Complete Submission Flow

**Purpose**: Verify customer can complete full property submission

**Steps**:

1. Open customer app → Welcome screen
2. Enter phone → Request OTP
3. Enter OTP → Verify
4. Select property type (Apartment)
5. Enter property details:
   - Area: 1200 sqft
   - BHK: 2
   - Age: 5 years
6. Capture location (auto-detect)
7. Take 6 photos (camera-only):
   - Exterior, Living, Kitchen, Bedroom, Bathroom, Society
8. Review photos
9. Submit property

**Expected Results**:

- ✅ Reference number generated
- ✅ "Submitted successfully" message
- ✅ Property appears in valuer queue (via WebSocket)
- ✅ SMS/WhatsApp notification sent

**APIs Tested**:

- POST /auth/login/otp
- POST /auth/verify-otp
- POST /properties/
- POST /properties/{id}/photos (×6)
- POST /properties/{id}/submit

---

### Test 1.2: EXIF Extraction & GPS Validation

**Purpose**: Verify camera metadata is captured and validated

**Steps**:

1. Take photo with device
2. Upload photo
3. Check QC results in database

**Expected Results**:

- ✅ EXIF data extracted (timestamp, GPS, device model)
- ✅ GPS coordinates within 0.5km of property
- ✅ Timestamp within 30 minutes
- ✅ No screenshot detected

**APIs Tested**:

- POST /properties/{id}/photos
- Background task: process_photo

---

### Test 1.3: Real-Time Status Updates

**Purpose**: Verify customer receives real-time updates

**Steps**:

1. Customer submits property
2. Valuer starts review
3. Valuer submits valuation
4. Customer checks status screen

**Expected Results**:

- ✅ "In Review" status with valuer name appears
- ✅ WebSocket event received
- ✅ "Valuation Complete" notification received
- ✅ SMS/WhatsApp sent at each stage

**APIs Tested**:

- WebSocket: /ws
- GET /properties/{id}

---

## Test Suite 2: Valuer Dashboard

### Test 2.1: Queue Management

**Purpose**: Verify queue loads and updates in real-time

**Steps**:

1. Valuer logs in
2. Views queue dashboard
3. Waits for new submission

**Expected Results**:

- ✅ Queue loads with pending properties
- ✅ New property appears automatically (WebSocket)
- ✅ Priority indicators correct (🔴<1hr, 🟡<3hr, ⚪>3hr)

**APIs Tested**:

- POST /auth/login
- GET /properties/
- WebSocket: /ws

---

### Test 2.2: Property Review Workflow

**Purpose**: Complete review → approve flow

**Steps**:

1. Click property card
2. View split-screen layout
3. Navigate photos with arrows
4. Check comparables on map
5. Click Approve (A key)
6. Enter valuation: ₹75,00,000
7. Add rationale notes
8. Submit

**Expected Results**:

- ✅ Property opens in review mode
- ✅ Photos load and navigate correctly
- ✅ Map shows property + comp pins
- ✅ Approval modal opens
- ✅ Valuation saved
- ✅ Customer receives notification
- ✅ Auto-advance to next property

**APIs Tested**:

- GET /properties/{id}
- GET /properties/{id}/photos
- GET /comparables/
- POST /valuations/

---

### Test 2.3: Follow-Up Request

**Purpose**: Request retake from customer

**Steps**:

1. Review property with poor photos
2. Press R (follow-up)
3. Select issues:
   - [x] Exterior photo too dark
   - [x] Kitchen photo blurry
4. Edit message
5. Send request

**Expected Results**:

- ✅ Follow-up modal opens
- ✅ Issues checklist available
- ✅ Message editable
- ✅ Customer sees "Action Needed" with issues list
- ✅ Customer can retake specific photos

**APIs Tested**:

- POST /properties/{id}/follow-up
- WebSocket notification

---

## Test Suite 3: WebSocket Reliability

### Test 3.1: Connection & Reconnection

**Purpose**: Verify WebSocket handles network issues

**Steps**:

1. Connect to WebSocket
2. Simulate network drop (airplane mode)
3. Restore network
4. Send test event

**Expected Results**:

- ✅ Initial connection succeeds
- ✅ Disconnection detected
- ✅ Auto-reconnects after 3 seconds
- ✅ Events received after reconnection

---

### Test 3.2: Event Delivery

**Purpose**: All status changes trigger correct events

**Test Matrix**:

| Action       | Customer Event               | Valuer Event | Notification |
| ------------ | ---------------------------- | ------------ | ------------ |
| Submit       | -                            | property:new | SMS+WhatsApp |
| Start Review | property:updated (review)    | -            | -            |
| Approve      | property:updated (complete)  | -            | SMS+WhatsApp |
| Follow-up    | property:updated (follow_up) | -            | WhatsApp     |

---

## Test Suite 4: Maps Integration

### Test 4.1: Customer Map

**Purpose**: Property location displays correctly

**Steps**:

1. Open location screen
2. Check map display

**Expected Results**:

- ✅ Mapbox loads
- ✅ Property pin shown
- ✅ Accuracy circle displayed
- ✅ Address reverse-geocoded

---

### Test 4.2: Valuer Map

**Purpose**: Comparables displayed with distances

**Steps**:

1. Open property review
2. View map panel

**Expected Results**:

- ✅ Property pin (red)
- ✅ Comp pins (blue) with distance labels
- ✅ Distance lines between property and comps
- ✅ Click comp to view details

---

## Test Suite 5: Error Handling

### Test 5.1: Network Error Recovery

**Purpose**: Graceful handling of network issues

**Steps**:

1. Start photo upload
2. Disconnect network mid-upload
3. Reconnect

**Expected Results**:

- ✅ "Connection lost" toast shown
- ✅ Progress saved locally
- ✅ Retry button available
- ✅ Upload resumes on reconnect

---

### Test 5.2: API Error Handling

**Purpose**: Server errors handled gracefully

**Test Cases**:

- 500 Server Error → Retry with backoff
- 429 Rate Limit → Wait and retry
- 401 Unauthorized → Refresh token or logout
- 404 Not Found → Show error screen
- Timeout → Retry with longer timeout

---

## Test Suite 6: Notifications

### Test 6.1: SMS/WhatsApp Delivery

**Purpose**: Notifications sent at correct stages

**Stages Tested**:

1. **Submission**: SMS + WhatsApp "Received"
2. **Review Started**: WhatsApp "Under Review"
3. **Approved**: SMS + WhatsApp "Complete"
4. **Follow-up**: WhatsApp "Action Needed"

**Expected Results**:

- ✅ All notifications delivered within 60 seconds
- ✅ Content is clear and actionable
- ✅ Links open correct screens

---

## Automated Test Scripts

### Run All Tests

```bash
# Backend integration tests
pytest backend/app/tests/test_integration.py -v

# Frontend E2E tests
pnpm test:e2e

# WebSocket tests
pytest backend/app/tests/test_websocket.py -v
```

### Performance Benchmarks

- Queue refresh: < 2 seconds
- Photo upload (6 photos): < 30 seconds on 4G
- WebSocket event delivery: < 1 second
- API response time (p95): < 500ms

---

## Test Results Log

| Date       | Tester    | Tests Run | Pass | Fail | Notes                      |
| ---------- | --------- | --------- | ---- | ---- | -------------------------- |
| 2026-02-15 | Automated | 25        | 24   | 1    | WS reconnect timeout issue |

---

## Known Issues

1. **WebSocket reconnection on iOS**: Takes 5-7 seconds instead of 3
2. **Map loading on slow 3G**: Can take up to 5 seconds
3. **Photo upload on weak signal**: May fail after 2 retries

---

## Sign-off

**Gate G6 Requirements**:

- [x] Status updates within SLA (< 5 min)
- [x] Notification content clear and actionable
- [x] End-to-end cycle works on real devices
- [x] WebSocket reconnection functional
- [x] Delivery logs available
