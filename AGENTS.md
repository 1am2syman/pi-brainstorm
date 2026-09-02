# Maintenance

- `extensions/brainstorm.ts` owns `/brainstorm`, session state, footer status, approval detection, and tool enforcement; `skills/brainstorm/SKILL.md` owns response style only.
- Keep `/approved` unregistered: the extension recognizes it only as an inline token while brainstorm mode is active.
- Validate `npm run check` and `npm pack --dry-run` before publishing `pi-brainstorm-mode`.
