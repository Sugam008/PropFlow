# Release Notes - Customer Portal v1.0.0

**Date:** 2026-02-16
**Release Commit:** 2cbfa29e317faf1c61845c1035ed94ffaf841040
**Release Tag:** release/customer-portal-v1.0.0
**Builder:** Trae

## Summary

This release marks the completion of the customer portal migration, replacing the legacy mobile app with a responsive web application. The new portal achieves feature parity with the valuer dashboard and introduces a streamlined property valuation wizard.

## Key Features

- **Authentication:** Secure OTP-based login flow.
- **Valuation Wizard:** Multi-step form for property details, location, and photo uploads.
- **Dashboard:** Unified view of property valuations and status.
- **Results & Follow-up:** Interactive valuation results and feedback loop.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop.
- **PWA Support:** Installable as a Progressive Web App.

## Route Map

| Route                      | Access    | Description                  |
| -------------------------- | --------- | ---------------------------- |
| `/`                        | Protected | Dashboard / Home             |
| `/login`                   | Public    | Authentication entry point   |
| `/new`                     | Protected | Start new valuation          |
| `/new/details`             | Protected | Property details form        |
| `/new/location`            | Protected | Map and address confirmation |
| `/new/photos`              | Protected | Photo upload interface       |
| `/new/review`              | Protected | Review and submit            |
| `/property/[id]`           | Protected | Property status and details  |
| `/property/[id]/result`    | Protected | Valuation outcome            |
| `/property/[id]/follow-up` | Protected | Post-valuation feedback      |

## Technical Details

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + @propflow/ui
- **State Management:** Zustand
- **API:** REST + WebSocket integration

## Rollback Plan

In case of critical failure, revert to the previous stable commit:

```bash
git revert 2cbfa29e317faf1c61845c1035ed94ffaf841040
# or checkout the rollback tag
git checkout v0.9.0-legacy
```

**Rollback Tag:** `v0.9.0-legacy`
**Rollback Commit:** `8504d39487888c00221c1b86bc8dbc2d0483220a` (pre-migration baseline)
