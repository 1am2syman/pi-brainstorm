import assert from "node:assert/strict";
import test from "node:test";
import {
	containsApprovalToken,
	readOnlyTools,
	removeApprovalToken,
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
