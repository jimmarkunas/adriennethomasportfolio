See `AGENTS.md` for project-wide rules.

## Case Study Workflow (Compact)
- Runtime files: `src/content/case-studies/`
- Source briefs: `docs/case-studies/`
- Slug/file/diagram lookup starts in: `src/content/case-studies/case-study-map.ts`
- When both exist, preserve brief metrics, tone, and hierarchy in runtime schema updates.
- Avoid generic PM/resume wording when updating copy.
- Default checks: `npm run verify:route -- /work/<slug>`; pre-deploy: `npm run verify:predeploy`.
