# Device Matrix Validation Checklist

PropFlow must be tested on the following device matrix before release.

## Mobile Devices - Customer App

### Budget Android (Android 7, 2GB RAM)

**Device Example**: Samsung Galaxy J2 (2016)

- [ ] App installs successfully (< 50MB)
- [ ] Login with OTP works
- [ ] Camera capture works without lag
- [ ] Photos upload successfully
- [ ] GPS location detected
- [ ] Property submission completes
- [ ] Status tracking updates
- [ ] UI responsive (no layout breaks)
- [ ] No crashes during 30-minute session
- [ ] Memory usage < 150MB

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### Mid-Range Android (Android 12+, 4GB+ RAM)

**Device Example**: Redmi Note 11, Samsung Galaxy A32

- [ ] All Budget Android tests pass
- [ ] Smooth camera transitions
- [ ] Fast photo upload (< 5s per photo)
- [ ] Map renders smoothly
- [ ] Animations at 60fps
- [ ] App cold start < 3s

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### iOS Baseline (iPhone 8, iOS 13)

- [ ] App installs from App Store
- [ ] Camera permission flow smooth
- [ ] Photo capture works
- [ ] GPS accuracy within 10m
- [ ] Notification permissions work
- [ ] Submission flow complete
- [ ] No iOS-specific UI issues

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### iOS Current (iPhone 14, iOS 17)

- [ ] All iOS baseline tests pass
- [ ] Dynamic Island compatibility (if applicable)
- [ ] Smooth haptic feedback
- [ ] Face ID/Touch ID integration

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### Tablet Portrait (iPad Mini, Android Tablet)

- [ ] UI scales correctly
- [ ] Touch targets remain ≥ 44×44px
- [ ] Camera works in both orientations
- [ ] Keyboard doesn't obscure inputs

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### Tablet Landscape

- [ ] All portrait tests pass
- [ ] Split-view compatible
- [ ] No layout issues in landscape

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

## Desktop Devices - Valuer Dashboard

### Chrome 90+ (Windows 10)

- [ ] Dashboard loads < 2s
- [ ] Split-screen layout works
- [ ] Keyboard shortcuts functional
- [ ] Queue updates in real-time
- [ ] Property review complete flow
- [ ] Photos navigate smoothly
- [ ] Map renders with comp pins
- [ ] Export to PDF works

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### Chrome 90+ (macOS)

- [ ] All Windows tests pass
- [ ] Retina display images sharp
- [ ] Trackpad gestures work

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### Firefox (Latest)

- [ ] Dashboard loads correctly
- [ ] No CSS rendering issues
- [ ] All features functional
- [ ] Keyboard navigation works

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### Safari (macOS, Latest)

- [ ] Dashboard loads correctly
- [ ] WebSocket connection stable
- [ ] Map renders correctly
- [ ] File downloads work

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### Safari (iPad)

- [ ] Touch interactions work
- [ ] Responsive layout adapts
- [ ] No mobile-specific issues

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### Edge (Windows 10)

- [ ] All Chrome tests pass
- [ ] Enterprise features work
- [ ] No Microsoft-specific issues

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

## Network Conditions

### 4G/LTE (Good Signal)

- [ ] Photo upload (6 photos) < 30s
- [ ] Queue refresh < 2s
- [ ] Map loads < 3s
- [ ] Real-time updates < 1s delay

### 3G (Slow)

- [ ] App loads < 5s
- [ ] Photo upload completes (with progress)
- [ ] Graceful degradation (low-res images)
- [ ] Retry logic works

### Intermittent (On/Off)

- [ ] Offline detection works
- [ ] Queue shows "Reconnecting..."
- [ ] Auto-retry on reconnect
- [ ] No data loss

## Accessibility Testing

### VoiceOver (iOS)

- [ ] All screens readable
- [ ] Buttons labeled correctly
- [ ] Navigation logical
- [ ] No focus traps

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### TalkBack (Android)

- [ ] All screens readable
- [ ] Touch targets announced
- [ ] Gestures work

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

### NVDA (Windows)

- [ ] Dashboard navigable
- [ ] All buttons accessible
- [ ] Tables readable
- [ ] Forms completable

**Notes**:

```
Tester: _____________ Date: _______
Issues Found: ____________________
```

## Performance Targets

| Metric                         | Target  | Tested | Passed |
| ------------------------------ | ------- | ------ | ------ |
| FCP (First Contentful Paint)   | < 1.5s  |        |        |
| LCP (Largest Contentful Paint) | < 2.5s  |        |        |
| CLS (Cumulative Layout Shift)  | < 0.1   |        |        |
| FID (First Input Delay)        | < 100ms |        |        |
| Bundle Size                    | < 25MB  |        |        |
| API p95 Latency                | < 500ms |        |        |

## Sign-off

**Validated By**: ******\_\_\_******
**Date**: ******\_\_\_******

### Critical Issues Found: \_\_\_

### High Issues Found: \_\_\_

### Medium Issues Found: \_\_\_

### Release Recommendation:

- [ ] Go - All tests passed
- [ ] Go with reservations - Minor issues only
- [ ] No-Go - Critical issues found

**Comments**:

```

```
