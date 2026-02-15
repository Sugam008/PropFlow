# ADR 002: Demo vs Production Track Strategy

## Status
Proposed

## Context
There is a requirement for a fast proof-of-concept (Track A) to validate the user journey with stakeholders within 48 hours, while simultaneously building a production-grade system (Track B).

## Decision
We will separate the two tracks as follows:

- **Track A: Stakeholder Demo**
  - Scope: S1-S8 (Customer Flow) and V1-V2 (Valuer Review).
  - Tools: Glide/Retool or lightweight coded frontend with mock backend.
  - Goal: Rapid feedback on UX and flow.
- **Track B: Production Build**
  - Scope: Full plan as defined in `execution-plan.md`.
  - Tools: Full stack defined in ADR 001.
  - Goal: Security, quality, observability, and long-term maintenance.

## Implementation Rule
- Track A should NOT use code intended for Track B unless it is a simple shared asset (e.g., icons, theme colors).
- This agent execution loop focuses exclusively on **Track B: Production Build**.

## Consequences
- Parallel tracks may lead to divergent UI/UX if not synchronized.
- High velocity for Demo while maintaining engineering discipline for Production.
