# Agent Guardrails

## Purpose
Protect work in progress, avoid destructive edits, and keep visual changes deterministic.

## Recovery-First Rule
- Never delete uncommitted work.
- Before any destructive change, create all three backups:
1. `git stash push -u -m "pre-destructive-step-1"`
2. `git diff > /tmp/pre-destructive-step-2.patch`
3. `git branch backup/pre-destructive-step-3-<timestamp>`

## Visual Change Discipline
- Use screenshot/wireframe as source of truth.
- Change one layout variable at a time.
- If asked for a single nudge, change only that value.
- If two attempts fail on the same visual issue, stop and present a short plan.

## Scope Control
- Prefer smallest safe change.
- Do not refactor during visual tweaks unless explicitly requested.
- Preserve mobile/tablet/desktop behavior when touching shared components.

## Token + Execution Efficiency
- Solve one root cause per attempt; no stacked speculative edits.
- For single-fix requests, limit each attempt to a maximum of 3 files changed.
- Verify with smallest possible check first, then run broader checks once.
- If an edit worsens output, revert that edit immediately before trying again.
- After two failed attempts on the same issue, stop and present a short 3-step plan.

## Data and Content
- Keep case study source truth in `docs/case-studies/`.
- Keep runtime schema truth in `src/content/case-studies/`.
- Preserve stated metrics exactly.
- Preserve first-person ownership where present.

## Platform Rules
- Keep content in `src/content/`, not inline inside components.
- Use project tokens and existing styles before ad-hoc values.
- Preserve primary CTA copy: `Book a Call`.
