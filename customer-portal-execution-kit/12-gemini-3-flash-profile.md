# 12 - Gemini 3 Flash Profile (Research-Based)

This file captures practical execution guidance for Gemini 3 Flash in this migration.

---

## Recommended runtime settings

- Model: `gemini-3-flash-preview`
- Thinking level: `high` for migration phases by default
- Temperature: keep default `1.0`
- Do not force low temperature for determinism in complex tasks

Why:

- Gemini 3 uses dynamic thinking and defaults to `high`.
- Google recommends temperature `1.0`; lower values can cause loops or degraded reasoning in complex tasks.

---

## Prompting style that works best

1. Use direct, concise instructions.
2. Avoid over-engineered, verbose meta-prompts.
3. For large context, put the exact task question/instruction at the end.
4. Use strict output templates for phase completion reporting.
5. Use one-phase-per-session and small edit batches.

---

## Known model-operational facts

- Input context window: up to 1,000,000 tokens
- Max output: up to 64k tokens
- Knowledge cutoff: January 2025

Implication for this project:

- Large codebase reasoning is viable, but session discipline still matters.
- Use explicit checkpoints to avoid long-loop failure modes.

---

## Migration-specific tuning

- Keep `high` thinking for phases 1-10 where reasoning depth matters.
- If running repetitive cleanup grep tasks, `low` is acceptable.
- Keep completion declarations structured and gate-based.
- Prefer copy-then-adapt over regenerate-from-scratch.

---

## Source references

- Google AI for Developers: Gemini 3 Developer Guide (`thinking_level`, temperature guidance, prompting guidance, FAQ)
- Google Developers Blog: Gemini 3 Flash in Gemini CLI (agentic coding workflow characteristics)
