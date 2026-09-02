# pi-brainstorm

A persistent, discussion-only brainstorm mode for [Pi](https://github.com/earendil-works/pi).

`/brainstorm` toggles a real Pi runtime mode. While active, the package shows `● brainstorm` in the TUI footer, limits the agent to read-only tools, injects a narrated brainstorming style, and requires the exact inline token `/approved` before implementation.

```text
regular -- /brainstorm [query] --> brainstorm (footer status + read-only)
regular <-- /brainstorm -------- brainstorm (exit without implementation)
regular <-- inline /approved ---- brainstorm (exit and implement)
regular -- /approved -----------> regular (no special effect)
```

## Package shape

```text
pi-brainstorm/
├── extensions/
│   └── brainstorm.ts          # command, state, status, approval, enforcement
└── skills/
    └── brainstorm/
        └── SKILL.md           # narrated response and visual style
```

This remains a skill-driven capability, with a Pi extension providing the runtime guarantees that Markdown alone cannot provide.

## Install from npm

After `pi-brainstorm-mode` is published:

```bash
pi install npm:pi-brainstorm-mode
npx skills add humanlayer/skills -g --agent pi --skill show-me -y
```

Restart Pi or run `/reload`.

The `show-me` dependency supplies the ASCII and Mermaid visualization guidance used during brainstorming.

## Install from GitHub

```bash
pi install git:github.com/1am2syman/pi-brainstorm
npx skills add humanlayer/skills -g --agent pi --skill show-me -y
```

Restart Pi or run `/reload`.

## Agent-driven installation

Give a coding agent this instruction:

> Install the Pi package with `pi install npm:pi-brainstorm-mode`. Install its visual response dependency with `npx skills add humanlayer/skills -g --agent pi --skill show-me -y`. Then run `/reload` if Pi is already open. Verify that `/brainstorm` is registered and tell me that active mode appears as `● brainstorm` in the TUI footer.

## Usage

Start the mode, optionally with the first question:

```text
/brainstorm How should we redesign the authentication flow?
```

While active:

- the footer shows `● brainstorm`;
- responses use narrated natural language;
- substantive responses include an ASCII or Mermaid visual;
- mutating tools are unavailable and independently blocked;
- “go ahead” and “implement it” remain discussion-only.

Exit without implementation by toggling again:

```text
/brainstorm
```

Exit and authorize the agreed implementation by including `/approved` in a normal message:

```text
Proceed with the approach we agreed on: /approved
```

`/approved` is deliberately not a registered slash command and does not appear in autocomplete. Outside active brainstorm mode, it has no special meaning.

## State behavior

Mode state is recorded in the Pi session. Resuming that session restores both the read-only tool set and the footer indicator. New sessions begin in regular mode unless their own history contains an active brainstorm state.

## Updating

```bash
pi update npm:pi-brainstorm-mode
```

To update the GitHub installation instead:

```bash
pi update git:github.com/1am2syman/pi-brainstorm
```

## Uninstall

```bash
pi remove npm:pi-brainstorm-mode
```

If installed from GitHub:

```bash
pi remove git:github.com/1am2syman/pi-brainstorm
```

The separately installed `show-me` skill can remain available for other workflows.

## Development

```bash
npm install
npm run check
npm pack --dry-run
```

## Security

Pi extensions execute with the user's permissions. Review [`extensions/brainstorm.ts`](extensions/brainstorm.ts) before installation. The extension changes active tools, injects mode instructions, stores a small session-state entry, and renders a footer status; it does not run shell commands or make network requests.

## License

MIT
