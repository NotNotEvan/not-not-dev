import { homedir } from "node:os";
import { basename, relative, resolve } from "node:path";
import {
	isToolCallEventType,
	type ExtensionAPI,
	type ExtensionContext,
} from "@mariozechner/pi-coding-agent";

type GuardrailRisk = {
	label: string;
	detail: string;
	severity: "warning" | "danger";
};

const SENSITIVE_BASENAMES = new Set([
	".env",
	".npmrc",
	".netrc",
	".git-credentials",
	"id_rsa",
	"id_ed25519",
	"known_hosts",
]);

const SENSITIVE_SUFFIXES = [".pem", ".key", ".p12", ".pfx"];
const HOME_SENSITIVE_PREFIXES = ["/.ssh/", "/.aws/", "/.kube/", "/.gnupg/"];
const HOME_SENSITIVE_SUFFIXES = ["/.docker/config.json", "/.pi/agent/auth.json"];

function normalizePath(path: string): string {
	return path.replace(/\\/g, "/");
}

function isInsideDir(parent: string, target: string): boolean {
	const rel = relative(parent, target);
	return rel === "" || (!rel.startsWith("..") && rel !== "..");
}

function shortPath(path: string, cwd: string): string {
	const rel = relative(cwd, path);
	if (rel && !rel.startsWith("..")) return rel;

	const home = homedir();
	return path.startsWith(home) ? `~${path.slice(home.length)}` : path;
}

function hasLongFlag(command: string, flag: string): boolean {
	return new RegExp(`(^|\\s)--${flag}(?=\\s|$)`).test(command);
}

function hasShortFlag(command: string, flag: string): boolean {
	return new RegExp(`(^|\\s)-[^\\s]*${flag}[^\\s]*(?=\\s|$)`).test(command);
}

function commandHasRiskyDelete(command: string): boolean {
	return /\brm\b/.test(command)
		&& (hasShortFlag(command, "r") || hasLongFlag(command, "recursive"))
		&& (hasShortFlag(command, "f") || hasLongFlag(command, "force"));
}

function commandHasGitResetHard(command: string): boolean {
	return /\bgit\s+reset\s+--hard\b/.test(command);
}

function commandHasGitClean(command: string): boolean {
	return /\bgit\s+clean\b/.test(command) && hasShortFlag(command, "f") && hasShortFlag(command, "d");
}

function getBashRisks(command: string): GuardrailRisk[] {
	const lower = command.toLowerCase();
	const risks: GuardrailRisk[] = [];

	if (commandHasRiskyDelete(lower)) {
		risks.push({
			label: "recursive force delete",
			detail: "Command includes rm with recursive + force flags",
			severity: "danger",
		});
	}

	if (commandHasGitResetHard(lower)) {
		risks.push({
			label: "git reset --hard",
			detail: "Command discards tracked changes with git reset --hard",
			severity: "danger",
		});
	}

	if (commandHasGitClean(lower)) {
		risks.push({
			label: "git clean",
			detail: "Command removes untracked files with git clean -fd",
			severity: "danger",
		});
	}

	if (/(^|\s)sudo(\s|$)/.test(lower)) {
		risks.push({
			label: "sudo",
			detail: "Command requests elevated privileges via sudo",
			severity: "warning",
		});
	}

	return risks;
}

function getSensitivePathReason(path: string): string | undefined {
	const normalized = normalizePath(path).toLowerCase();
	const home = normalizePath(homedir()).toLowerCase();
	const base = basename(normalized);

	if (SENSITIVE_BASENAMES.has(base)) return `Path targets a sensitive file (${base})`;
	if (base.startsWith(".env.")) return `Path targets an environment file (${base})`;
	if (SENSITIVE_SUFFIXES.some((suffix) => base.endsWith(suffix))) {
		return `Path looks like a key or certificate file (${base})`;
	}

	if (normalized.startsWith(`${home}/`)) {
		if (HOME_SENSITIVE_PREFIXES.some((prefix) => normalized.includes(prefix))) {
			return "Path is inside a sensitive home-directory configuration area";
		}
		if (HOME_SENSITIVE_SUFFIXES.some((suffix) => normalized.endsWith(suffix))) {
			return "Path targets stored credentials or auth configuration";
		}
	}

	return undefined;
}

function getWriteRisks(path: string, cwd: string): GuardrailRisk[] {
	const resolvedPath = resolve(cwd, path);
	const cwdRoot = resolve(cwd);
	const risks: GuardrailRisk[] = [];

	if (!isInsideDir(cwdRoot, resolvedPath)) {
		risks.push({
			label: "outside cwd",
			detail: `Write target is outside the current project directory: ${shortPath(resolvedPath, cwd)}`,
			severity: "warning",
		});
	}

	const sensitiveReason = getSensitivePathReason(resolvedPath);
	if (sensitiveReason) {
		risks.push({
			label: "sensitive path",
			detail: `${sensitiveReason}: ${shortPath(resolvedPath, cwd)}`,
			severity: "danger",
		});
	}

	return risks;
}

function summarizeCommand(command: string): string {
	const singleLine = command.replace(/\s+/g, " ").trim();
	if (!singleLine) return "(empty command)";
	if (singleLine.length <= 140) return singleLine;
	return `${singleLine.slice(0, 137)}...`;
}

async function confirmRisks(
	ctx: ExtensionContext,
	toolLabel: string,
	targetSummary: string,
	risks: GuardrailRisk[],
): Promise<boolean> {
	const riskLines = risks.map((risk) => `- ${risk.detail}`).join("\n");
	const title = risks.some((risk) => risk.severity === "danger")
		? "Guardrails: confirm risky action"
		: "Guardrails: confirm action";
	const message = `${toolLabel}: ${targetSummary}\n\nReasons:\n${riskLines}\n\nAllow this action?`;
	return ctx.ui.confirm(title, message);
}

function getBlockReason(risks: GuardrailRisk[]): string {
	return `Blocked by guardrails: ${risks.map((risk) => risk.label).join(", ")}`;
}

export default function (pi: ExtensionAPI) {
	let enabled = true;

	pi.registerCommand("guardrails", {
		description: "Toggle guardrails on/off, or show status",
		handler: async (args, ctx) => {
			const action = (args || "").trim().toLowerCase();

			if (!action || action === "toggle") {
				enabled = !enabled;
				ctx.ui.notify(`Guardrails ${enabled ? "enabled" : "disabled"}`, enabled ? "success" : "warning");
				return;
			}

			if (action === "on" || action === "enable") {
				enabled = true;
				ctx.ui.notify("Guardrails enabled", "success");
				return;
			}

			if (action === "off" || action === "disable") {
				enabled = false;
				ctx.ui.notify("Guardrails disabled", "warning");
				return;
			}

			if (action === "status") {
				ctx.ui.notify(
					`Guardrails are ${enabled ? "enabled" : "disabled"}. Checks include risky bash commands, sensitive file writes, and writes outside the current project.",
					"info",
				);
				return;
			}

			ctx.ui.notify("Usage: /guardrails [toggle|on|off|status]", "info");
		},
	});

	pi.on("tool_call", async (event, ctx) => {
		if (!enabled) return;

		let risks: GuardrailRisk[] = [];
		let targetSummary = event.toolName;

		if (isToolCallEventType("bash", event)) {
			risks = getBashRisks(event.input.command);
			targetSummary = summarizeCommand(event.input.command);
		}

		if (isToolCallEventType("write", event) || isToolCallEventType("edit", event)) {
			risks = getWriteRisks(event.input.path, ctx.cwd);
			targetSummary = shortPath(resolve(ctx.cwd, event.input.path), ctx.cwd);
		}

		if (risks.length === 0) return;

		if (!ctx.hasUI) {
			return {
				block: true,
				reason: getBlockReason(risks),
			};
		}

		const allowed = await confirmRisks(ctx, event.toolName, targetSummary, risks);
		if (allowed) return;

		return {
			block: true,
			reason: getBlockReason(risks),
		};
	});
}
