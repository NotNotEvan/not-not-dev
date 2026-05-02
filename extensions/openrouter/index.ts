import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

type OpenRouterStats = {
	available: boolean;
	totalCredits?: number;
	totalUsage?: number;
	remainingCredits?: number;
	lastUpdated?: number;
	error?: string;
};

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

function getAgentDir(): string {
	return process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
}

function getOpenRouterApiKey(): string | undefined {
	if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;

	try {
		const authPath = join(getAgentDir(), "auth.json");
		if (!existsSync(authPath)) return undefined;
		const auth = JSON.parse(readFileSync(authPath, "utf8")) as {
			openrouter?: { key?: string };
		};
		return auth.openrouter?.key;
	} catch {
		return undefined;
	}
}

async function getJson<T>(url: string, apiKey: string): Promise<T> {
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	});

	if (!response.ok) {
		throw new Error(`${response.status} ${response.statusText}`);
	}

	return (await response.json()) as T;
}

async function fetchOpenRouterStats(): Promise<OpenRouterStats> {
	const apiKey = getOpenRouterApiKey();
	if (!apiKey) {
		return { available: false, error: "No OpenRouter API key found" };
	}

	try {
		const [credits, auth] = await Promise.all([
			getJson<{ data?: { total_credits?: number; total_usage?: number } }>(
				"https://openrouter.ai/api/v1/credits",
				apiKey,
			),
			getJson<{ data?: { usage?: number } }>("https://openrouter.ai/api/v1/auth/key", apiKey),
		]);

		const totalCredits = credits.data?.total_credits;
		const totalUsage = credits.data?.total_usage ?? auth.data?.usage;
		const remainingCredits =
			totalCredits !== undefined && totalUsage !== undefined ? Math.max(0, totalCredits - totalUsage) : undefined;

		return {
			available: totalCredits !== undefined || totalUsage !== undefined,
			totalCredits,
			totalUsage,
			remainingCredits,
			lastUpdated: Date.now(),
		};
	} catch (error) {
		return {
			available: false,
			error: error instanceof Error ? error.message : String(error),
			lastUpdated: Date.now(),
		};
	}
}

function formatMoney(value?: number): string {
	if (value === undefined || Number.isNaN(value)) return "?";
	return `$${value.toFixed(2)}`;
}

function formatTokens(value?: number | null): string {
	if (!value || Number.isNaN(value)) return "?";
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
	if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
	return `${value}`;
}

function formatCwd(cwd: string): string {
	const home = homedir();
	return cwd.startsWith(home) ? `~${cwd.slice(home.length)}` : cwd;
}

function joinParts(parts: Array<string | undefined>, separator: string): string {
	return parts.filter((part): part is string => Boolean(part)).join(separator);
}

function fitLeftRight(left: string, right: string, width: number): string {
	if (width <= 0) return "";
	if (!left) return truncateToWidth(right, width);
	if (!right) return truncateToWidth(left, width);

	const space = 1;
	const total = visibleWidth(left) + space + visibleWidth(right);
	if (total <= width) {
		return `${left}${" ".repeat(width - visibleWidth(left) - visibleWidth(right))}${right}`;
	}

	const maxLeft = Math.max(0, width - visibleWidth(right) - space);
	const trimmedLeft = truncateToWidth(left, maxLeft);
	const secondTotal = visibleWidth(trimmedLeft) + space + visibleWidth(right);
	if (secondTotal <= width) {
		return `${trimmedLeft}${" ".repeat(width - visibleWidth(trimmedLeft) - visibleWidth(right))}${right}`;
	}

	const maxRight = Math.max(0, width - visibleWidth(trimmedLeft) - space);
	const trimmedRight = truncateToWidth(right, maxRight);
	return truncateToWidth(`${trimmedLeft} ${trimmedRight}`, width);
}

export default function (pi: ExtensionAPI) {
	let stats: OpenRouterStats = { available: false, error: "Waiting for first refresh" };
	let refreshTimer: ReturnType<typeof setInterval> | undefined;
	let refreshInFlight: Promise<void> | undefined;
	let activeTui: { requestRender: () => void } | undefined;

	const requestRender = () => activeTui?.requestRender();

	const refreshStats = async () => {
		if (refreshInFlight) return refreshInFlight;

		refreshInFlight = (async () => {
			stats = await fetchOpenRouterStats();
			requestRender();
		})().finally(() => {
			refreshInFlight = undefined;
		});

		return refreshInFlight;
	};

	const stopRefreshTimer = () => {
		if (!refreshTimer) return;
		clearInterval(refreshTimer);
		refreshTimer = undefined;
	};

	const startRefreshTimer = () => {
		stopRefreshTimer();
		refreshTimer = setInterval(() => {
			void refreshStats();
		}, REFRESH_INTERVAL_MS);
	};

	pi.registerCommand("openrouter-footer-refresh", {
		description: "Refresh OpenRouter usage and credit stats in the footer",
		handler: async (_args, ctx) => {
			await refreshStats();
			ctx.ui.notify("OpenRouter footer refreshed", "info");
		},
	});

	pi.on("session_start", async (_event, ctx) => {
		if (!ctx.hasUI) return;

		startRefreshTimer();
		void refreshStats();

		ctx.ui.setFooter((tui, theme) => {
			activeTui = tui;

			return {
				invalidate() {},
				render(width: number): string[] {
					const divider = theme.fg("dim", " · ");
					const sessionName = pi.getSessionName();
					const modelLabel = ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : "no model";
					const contextUsage = ctx.getContextUsage();
					const contextWindow = contextUsage?.contextWindow ?? ctx.model?.contextWindow;
					const contextPercent = contextUsage?.percent;

					const left = joinParts(
						[
							theme.fg("dim", formatCwd(ctx.cwd)),
							sessionName ? theme.fg("muted", sessionName) : undefined,
						],
						divider,
					);

					const usageText =
						stats.totalUsage !== undefined ? `used ${formatMoney(stats.totalUsage)}` : undefined;
					const remainingText =
						stats.remainingCredits !== undefined ? `left ${formatMoney(stats.remainingCredits)}` : undefined;
					const openRouterLabel = stats.available
						? theme.fg("success", joinParts(["OpenRouter", usageText, remainingText], " "))
						: theme.fg("warning", "OpenRouter unavailable");

					const contextLabel =
						contextWindow !== undefined
							? contextPercent !== null && contextPercent !== undefined
								? `ctx ${Math.round(contextPercent)}%/${formatTokens(contextWindow)}`
								: `ctx ${formatTokens(contextWindow)}`
							: "ctx ?";

					const right = joinParts(
						[
							openRouterLabel,
							theme.fg("accent", modelLabel),
							theme.fg("muted", contextLabel),
						],
						divider,
					);

					if (width < 110) {
						return [fitLeftRight(left, theme.fg("accent", modelLabel), width), fitLeftRight(openRouterLabel, theme.fg("muted", contextLabel), width)];
					}

					return [fitLeftRight(left, right, width)];
				},
			};
		});
	});

	pi.on("agent_end", async () => {
		void refreshStats();
	});

	pi.on("model_select", async () => {
		requestRender();
	});

	pi.on("thinking_level_select", async () => {
		requestRender();
	});

	pi.on("session_shutdown", async () => {
		stopRefreshTimer();
		activeTui = undefined;
	});
}
