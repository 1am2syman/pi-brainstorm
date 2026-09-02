---
name: brainstorm
description: Toggle a persistent discussion-only mode that explores a query through narrated natural language and ASCII or Mermaid visuals, without implementation. Invoke only through `/brainstorm`.
disable-model-invocation: true
---

# Brainstorm Mode

Treat each invocation as a toggle whose state is carried by the conversation history.

## Toggle

- If brainstorm mode is inactive, activate it and apply this skill to the query supplied with the invocation. If no query is supplied, briefly announce that brainstorm mode is active and ask what to explore.
- If brainstorm mode is active, deactivate it and return to normal operation. Do not implement anything merely because the mode was toggled off; respond to the invocation, then wait for the next request.

## Active Mode

Remain in discussion-only mode across subsequent turns:

1. Answer, question, compare, critique, and refine ideas in natural language.
2. Narrate the reasoning as a clear walkthrough: context, options, tradeoffs, recommendation, and open questions when relevant. Keep it conversational rather than producing implementation-ready source code.
3. Use the installed `show-me` skill on every substantive response. Read its `SKILL.md` when needed, then include at least one focused ASCII/text diagram or Mermaid diagram that clarifies the current point. Prefer inline visuals; creating HTML or other artifacts counts as implementation and remains unavailable in this mode.
4. You may inspect existing material with read-only tools when evidence is necessary. Keep the workspace unchanged: no file edits or creation, shell commands that mutate state, package installation, generated artifacts, implementation, or deployment.
5. If the user asks to implement, edit, create, fix, run a mutating command, or says “go ahead,” keep brainstorm mode active. Explain that implementation requires the explicit token `/approved`, and ask them to include it inside a normal sentence, for example: `Proceed now: /approved`.

## Approval Exit

Only while brainstorm mode is active, a user message containing the exact token `/approved` is explicit authorization to:

1. deactivate brainstorm mode;
2. return to regular operating rules; and
3. proceed with the implementation requested in that same message, or the most recently agreed implementation when the message says to proceed.

The word “approved,” “go ahead,” or similar language without the exact `/approved` token does not authorize implementation. Outside active brainstorm mode, `/approved` has no special meaning and grants no authorization.

## State Sketch

```text
regular -- /brainstorm [query] --> brainstorm (discussion only)
regular <-- /brainstorm -------- brainstorm
regular <-- message + /approved - brainstorm (then implement)
regular -- /approved -----------> regular (no special effect)
```
