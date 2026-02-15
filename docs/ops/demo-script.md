# PropFlow Showcase Demo Script

This script outlines the end-to-end user journey for the PropFlow platform demo, highlighting the key features for both the Customer and the Valuer.

## Demo Overview
- **Objective**: Showcase a seamless property valuation flow from submission to approval.
- **Duration**: ~10 minutes.
- **Persona 1**: Rahul (Property Owner/Customer)
- **Persona 2**: Priya (Certified Valuer/Admin)

---

## Scene 1: Customer Property Submission
**Objective**: Show ease of use on mobile and AI-assisted data entry.

1. **Rahul opens the PropFlow App**.
   - *Talk Track*: "Rahul wants to get his home valued for a loan. He opens PropFlow and sees a clean, branded interface."
2. **Rahul starts a new valuation request**.
   - He enters his address. PropFlow auto-suggests coordinates and property details.
3. **Rahul uploads photos**.
   - *Feature Highlight*: Show the real-time QC feedback (e.g., "Photo is clear", "GPS tag confirmed").
4. **Rahul submits the request**.
   - *Animation*: Show the smooth submission transition and confirmation screen.

---

## Scene 2: Valuer Review Workspace
**Objective**: Show the efficient review interface and data-driven decision making.

1. **Priya logs into the Valuer Dashboard**.
   - *Talk Track*: "Priya sees the new request at the top of her high-priority queue."
2. **Priya opens the Request Detail**.
   - *Feature Highlight*: Showcase the **Split-Screen Workspace**. Photos on the left, data on the right.
3. **Priya reviews the AI-suggested Comparables (Comps)**.
   - She adjusts the valuation based on her local expertise.
4. **Priya generates the report**.
   - *Branding*: Show the final PDF report with Aditya Birla Capital (ABC) branding.

---

## Scene 3: Infrastructure & Performance (Technical Brief)
**Objective**: Prove operational excellence and speed.

1. **Performance Stats**: Mention the >90 Lighthouse score.
2. **Health Monitoring**: Briefly show the `/health` endpoint returning `ok`.
3. **Infrastructure**: Mention the Dockerized deployment for consistency.

---

## Troubleshooting & Backup Artifacts
- **Backup Data**: Pre-loaded requests are available in the `demo` tenant.
- **Offline Mode**: If the internet fails, show the mobile app's "Saved Drafts" feature.
- **Support**: Contact DevOps at #propflow-support for immediate issues.
