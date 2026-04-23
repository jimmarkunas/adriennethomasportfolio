## Claude Rules (Compact)

- Read narrowly: grep/find first, then open only the section you will change.
- Edit minimally: smallest safe diff, no unrelated refactors.
- Validate proportionally: `npm run verify:route -- /work/<slug>` first, full build only via `npm run verify:predeploy`.
- Respect `.aiignore`; default logs to short tails (`tail -n 40`).
- Follow `AGENTS.md` as the primary project policy.
