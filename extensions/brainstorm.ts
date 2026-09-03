import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const STATUS_ID = "brainstorm-mode";
const STATE_ENTRY = "brainstorm-mode";
const APPROVAL_TOKEN = /(^|\s)\/approved(?=$|\s|[.,!?;:])/;

const READ_ONLY_TOOLS = new Set([
	"analyze_image",
	"ask_user",
	"clarify_prompt",
	"fetch_content",
	"fffind",
	"ffgrep",
	"get_search_content",
	"lens_diagnostics",
	"lsp_diagnostics",
	"module_report",
	"project_report",
	"read",
	"read_enclosing",
	"read_symbol",
	"source_check",
	"symbol_search",
	"web_search",
	"agent_browser_web_search",
]);

const ACTIVE_MODE_INSTRUCTIONS = `[BRAINSTORM MODE ACTIVE]
You are in a persistent discussion-only mode.

- Explore, question, compare, critique, and refine ideas in natural language.
- Narrate the explanation as a clear walkthrough of context, options, tradeoffs, recommendations, and open questions when relevant.
- Use the installed show-me skill on every substantive response. Include at least one focused ASCII/text or Mermaid diagram that clarifies the current point.
- Use only read-only inspection when evidence is needed. Do not implement, edit files, create artifacts, deploy, or perform mutating actions.
- Requests such as "go ahead" or "implement it" remain discussion-only. Explain that implementation requires the exact token /approved inside a normal user message.
- Do not treat ordinary words such as "approved" as authorization.`;

const APPROVAL_SIGNAL =
	"[Brainstorm mode ended — /approved received. Implementation is authorized.]";

interface PersistedState {
	enabled?: boolean;
}

export function containsApprovalToken(text: string): boolean {
	return APPROVAL_TOKEN.test(text);
}

export function removeApprovalToken(text: string): string {
	return text.replace(APPROVAL_TOKEN, (_match, prefix: string) => prefix).replace(/\s{2,}/g, " ").trim();
}

export function readOnlyTools(toolNames: string[]): string[] {
	return toolNames.filter((name) => READ_ONLY_TOOLS.has(name));
}

export function approvalMessage(text: string): string {
	const request = removeApprovalToken(text) || "Proceed with the implementation we agreed on.";
	return `${APPROVAL_SIGNAL}\n\n${request}`;
}

export function withoutStaleBrainstormContext<T>(messages: T[]): T[] {
	return messages.filter(
		(message) =>
			(message as { customType?: string }).customType !== "brainstorm-mode-context",
	);
}

export default function brainstormExtension(pi: ExtensionAPI): void {
	let enabled = false;
	let toolsBeforeBrainstorm: string[] | undefined;

	function updateStatus(ctx: ExtensionContext): void {
		ctx.ui.setStatus(
			STATUS_ID,
			enabled ? ctx.ui.theme.fg("accent", "● brainstorm") : undefined,
		);
	}

	function persistState(): void {
		pi.appendEntry(STATE_ENTRY, { enabled });
	}

	function enable(ctx: ExtensionContext): void {
		if (enabled) return;
		enabled = true;
		toolsBeforeBrainstorm = pi.getActiveTools();
		pi.setActiveTools(readOnlyTools(toolsBeforeBrainstorm));
		updateStatus(ctx);
		persistState();
	}

	function disable(ctx: ExtensionContext): void {
		if (!enabled) return;
		enabled = false;
		if (toolsBeforeBrainstorm) {
			pi.setActiveTools(toolsBeforeBrainstorm);
		}
		toolsBeforeBrainstorm = undefined;
		updateStatus(ctx);
		persistState();
	}

	pi.registerCommand("brainstorm", {
		description: "Toggle persistent discussion-only brainstorm mode",
		handler: async (args, ctx) => {
			if (enabled) {
				disable(ctx);
				ctx.ui.notify("Brainstorm mode disabled. Regular mode restored.", "info");
				return;
			}

			enable(ctx);
			ctx.ui.notify("Brainstorm mode enabled. Read-only discussion mode is active.", "info");
			const query = args.trim();
			if (query) {
				pi.sendUserMessage(query);
			}
		},
	});

	pi.on("input", async (event, ctx) => {
		if (!enabled || !containsApprovalToken(event.text)) {
			return { action: "continue" };
		}

		disable(ctx);
		ctx.ui.notify("Approval received. Brainstorm mode disabled.", "info");
		return {
			action: "transform",
			text: approvalMessage(event.text),
		};
	});

	pi.on("context", async (event) => ({
		messages: withoutStaleBrainstormContext(event.messages),
	}));

	pi.on("before_agent_start", async (event) => {
		if (!enabled) return;
		return {
			systemPrompt: `${event.systemPrompt}\n\n${ACTIVE_MODE_INSTRUCTIONS}`,
		};
	});

	pi.on("tool_call", async (event) => {
		if (!enabled || READ_ONLY_TOOLS.has(event.toolName)) return;
		return {
			block: true,
			reason: `Brainstorm mode permits read-only discussion. Tool blocked: ${event.toolName}. Include /approved in a normal user message before implementation.`,
		};
	});

	pi.on("session_start", async (_event, ctx) => {
		const stateEntry = ctx.sessionManager
			.getEntries()
			.filter(
				(entry: { type: string; customType?: string }) =>
					entry.type === "custom" && entry.customType === STATE_ENTRY,
			)
			.pop() as { data?: PersistedState } | undefined;

		enabled = stateEntry?.data?.enabled === true;
		if (enabled) {
			toolsBeforeBrainstorm = pi.getActiveTools();
			pi.setActiveTools(readOnlyTools(toolsBeforeBrainstorm));
		}
		updateStatus(ctx);
	});
}
