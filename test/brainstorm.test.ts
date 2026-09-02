import assert from "node:assert/strict";
import test from "node:test";
import {
	containsApprovalToken,
	readOnlyTools,
	removeApprovalToken,
	withoutStaleBrainstormContext,
} from "../extensions/brainstorm.ts";

test("recognizes only the slash approval token", () => {
	assert.equal(containsApprovalToken("Proceed now: /approved"), true);
	assert.equal(containsApprovalToken("approved"), false);
	assert.equal(containsApprovalToken("/approved-extra"), false);
});

test("removes approval token while preserving the request", () => {
	assert.equal(
		removeApprovalToken("Proceed with the agreed design: /approved"),
		"Proceed with the agreed design:",
	);
});

test("keeps only allowlisted read-only tools", () => {
	assert.deepEqual(
		readOnlyTools(["read", "edit", "web_search", "bash", "write"]),
		["read", "web_search"],
	);
});

test("removes persisted brainstorm instructions after the mode exits", () => {
	const messages = [
		{ role: "user", content: "Discuss the design" },
		{
			role: "user",
			customType: "brainstorm-mode-context",
			content: "[BRAINSTORM MODE ACTIVE]",
		},
		{ role: "assistant", content: "Here are the tradeoffs" },
	];

	assert.deepEqual(withoutStaleBrainstormContext(messages), [messages[0], messages[2]]);
});

test("preserves ordinary messages that mention brainstorming", () => {
	const messages = [
		{ role: "user", content: "We are no longer brainstorming; implement it." },
		{ role: "assistant", content: "Starting implementation." },
	];

	assert.deepEqual(withoutStaleBrainstormContext(messages), messages);
});
