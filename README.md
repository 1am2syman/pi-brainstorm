# pi-brainstorm

A persistent, discussion-only brainstorm mode for [Pi](https://github.com/earendil-works/pi).

`/brainstorm` toggles a guardrail that keeps the agent in chat mode: it can explore ideas, compare options, inspect existing material read-only, and explain with ASCII or Mermaid diagrams, but it does not implement or modify files. Implementation begins only after the user includes the exact token `/approved` in a normal message.

```text
regular -- /brainstorm [query] --> brainstorm (discussion only)
regular <-- /brainstorm -------- brainstorm
regular <-- message + /approved - brainstorm (then implement)
regular -- /approved -----------> regular (no special effect)
```

## Features

- Persistent brainstorm state across conversation turns
- `/brainstorm` toggle in Pi's TUI autocomplete
- Discussion-only and read-only operation while active
- Explicit `/approved` exit before implementation
- Narrated natural-language explanations
- ASCII or Mermaid visuals through the `show-me` skill

## Requirements

- Pi with skill and prompt-template support
- Git
- Node.js and `npx` for installing the `show-me` dependency

## Human-driven installation

Run these commands yourself:

```bash
git clone https://github.com/1am2syman/pi-brainstorm.git
cd pi-brainstorm

mkdir -p ~/.pi/agent/skills/brainstorm ~/.pi/agent/prompts
cp skills/brainstorm/SKILL.md ~/.pi/agent/skills/brainstorm/SKILL.md
cp prompts/brainstorm.md ~/.pi/agent/prompts/brainstorm.md

npx skills add humanlayer/skills -g --agent pi --skill show-me -y
```

Restart Pi so `/brainstorm` appears in TUI autocomplete.

## Agent-driven installation

Give your coding agent this instruction:

> Install `pi-brainstorm` globally for Pi from `https://github.com/1am2syman/pi-brainstorm`. Clone the repository to a temporary directory, copy `skills/brainstorm/SKILL.md` to `~/.pi/agent/skills/brainstorm/SKILL.md`, and copy `prompts/brainstorm.md` to `~/.pi/agent/prompts/brainstorm.md`. Then run `npx skills add humanlayer/skills -g --agent pi --skill show-me -y`. Verify both files exist and tell me to restart Pi. Do not alter project repositories.

The agent should use this equivalent sequence:

```bash
tmp_dir="$(mktemp -d)"
git clone https://github.com/1am2syman/pi-brainstorm.git "$tmp_dir/pi-brainstorm"

mkdir -p ~/.pi/agent/skills/brainstorm ~/.pi/agent/prompts
cp "$tmp_dir/pi-brainstorm/skills/brainstorm/SKILL.md" ~/.pi/agent/skills/brainstorm/SKILL.md
cp "$tmp_dir/pi-brainstorm/prompts/brainstorm.md" ~/.pi/agent/prompts/brainstorm.md

npx skills add humanlayer/skills -g --agent pi --skill show-me -y
rm -rf "$tmp_dir"
```

Restart Pi after installation.

## Usage

Start brainstorm mode with a query:

```text
/brainstorm How should we redesign the authentication flow?
```

Continue the conversation normally. Requests such as “go ahead” or “implement it” remain discussion-only while the mode is active.

Exit without implementation by toggling again:

```text
/brainstorm
```

Exit and authorize the agreed implementation by including `/approved` inside a normal message:

```text
Proceed with the approach we agreed on: /approved
```

`/approved` is intentionally not a registered Pi command. Outside active brainstorm mode, it has no special meaning.

## Repository layout

```text
pi-brainstorm/
├── prompts/
│   └── brainstorm.md
└── skills/
    └── brainstorm/
        └── SKILL.md
```

The prompt template provides the `/brainstorm` TUI command. The skill contains the persistent mode rules.

## Uninstall

```bash
rm -rf ~/.pi/agent/skills/brainstorm
rm -f ~/.pi/agent/prompts/brainstorm.md
```

Restart Pi afterward.

## License

MIT
