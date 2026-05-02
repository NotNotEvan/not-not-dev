import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { Key, matchesKey, truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

type OpenRouterStats = {
	available: boolean;
	totalCredits?: number;
	totalUsage?: number;
	remainingCredits?: number;
	lastUpdated?: number;
	error?: string;
};

type FooterPlacement = "top" | "bottom" | "hidden";

type FooterPreferences = {
	order: string[];
	placement: Record<string, FooterPlacement>;
};

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const STATE_ENTRY_TYPE = "footer-state";
const DEFAULT_FOOTER_PREFERENCES: FooterPreferences = {
	order: [],
	placement: {},
};
const BUILTIN_FOOTER_ITEMS = ["openrouter", "model", "context"] as const;

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

function dedupe(values: string[]): string[] {
	return [...new Set(values.filter(Boolean))];
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

function rightAlign(text: string, width: number): string {
	if (width <= 0) return "";
	const trimmed = truncateToWidth(text, width);
	return `${" ".repeat(Math.max(0, width - visibleWidth(trimmed)))}${trimmed}`;
}

function wrapParts(parts: string[], width: number, separator: string): string[] {
	if (width <= 0 || parts.length === 0) return [];

	const lines: string[] = [];
	const separatorWidth = visibleWidth(separator);
	let currentParts: string[] = [];
	let currentWidth = 0;

	for (const part of parts) {
		const partWidth = visibleWidth(part);

		if (currentParts.length === 0) {
			if (partWidth <= width) {
				currentParts = [part];
				currentWidth = partWidth;
			} else {
				lines.push(truncateToWidth(part, width));
			}
			continue;
		}

		if (currentWidth + separatorWidth + partWidth <= width) {
			currentParts.push(part);
			currentWidth += separatorWidth + partWidth;
			continue;
		}

		lines.push(currentParts.join(separator));
		if (partWidth <= width) {
			currentParts = [part];
			currentWidth = partWidth;
		} else {
			lines.push(truncateToWidth(part, width));
			currentParts = [];
			currentWidth = 0;
		}
	}

	if (currentParts.length > 0) {
		lines.push(currentParts.join(separator));
	}

	return lines;
}

function wrapRightAlignedParts(parts: string[], width: number, separator: string): string[] {
	return wrapParts(parts, width, separator).map((line) => rightAlign(line, width));
}

function wrapRightBlockWithLeft(left: string, rightParts: string[], width: number, separator: string): string[] {
	if (width <= 0) return [];
	if (!left) return wrapRightAlignedParts(rightParts, width, separator);
	if (rightParts.length === 0) return [truncateToWidth(left, width)];

	const leftTrimmed = truncateToWidth(left, width);
	const availableRightWidth = width - visibleWidth(leftTrimmed) - 1;
	if (availableRightWidth < 16) {
		return [leftTrimmed, ...wrapRightAlignedParts(rightParts, width, separator)];
	}

	const wrappedRight = wrapParts(rightParts, availableRightWidth, separator);
	if (wrappedRight.length === 0) return [leftTrimmed];

	return [
		fitLeftRight(leftTrimmed, wrappedRight[0], width),
		...wrappedRight.slice(1).map((line) => rightAlign(line, width)),
	];
}

function normalizePreferences(input?: Partial<FooterPreferences>): FooterPreferences {
	return {
		order: Array.isArray(input?.order)
			? input.order.filter((value): value is string => typeof value === "string" && value.length > 0)
			: [],
		placement: Object.fromEntries(
			Object.entries(input?.placement ?? {}).filter((entry): entry is [string, FooterPlacement] => {
				return entry[0].length > 0 && ["top", "bottom", "hidden"].includes(entry[1]);
			}),
		),
	};
}

function loadSavedPreferences(ctx: ExtensionContext): FooterPreferences | undefined {
	const entries = ctx.sessionManager.getEntries();

	for (let i = entries.length - 1; i >= 0; i--) {
		const entry = entries[i] as {
			type?: string;
			customType?: string;
			data?: Partial<FooterPreferences>;
		};

		if (entry.type !== "custom" || entry.customType !== STATE_ENTRY_TYPE) continue;
		return normalizePreferences(entry.data);
	}

	return undefined;
}

function persistPreferences(pi: ExtensionAPI, preferences: FooterPreferences): void {
	pi.appendEntry(STATE_ENTRY_TYPE, preferences);
}

function parseOrderList(input: string): string[] {
	return dedupe(
		input
			.split(/[\s,]+/)
			.map((part) => part.trim())
			.filter(Boolean),
	);
}

function sortIds(ids: string[], preferredOrder: string[]): string[] {
	const rank = new Map(preferredOrder.map((name, index) => [name, index]));

	return [...ids].sort((a, b) => {
		const aRank = rank.get(a);
		const bRank = rank.get(b);
		if (aRank !== undefined && bRank !== undefined) return aRank - bRank;
		if (aRank !== undefined) return -1;
		if (bRank !== undefined) return 1;
		return a.localeCompare(b);
	});
}

function getPlacement(preferences: FooterPreferences, id: string): FooterPlacement {
	return preferences.placement[id] ?? "top";
}

function getKnownFooterItems(preferences: FooterPreferences, seenItems: string[]): string[] {
	return dedupe([
		...BUILTIN_FOOTER_ITEMS,
		...seenItems,
		...preferences.order,
		...Object.keys(preferences.placement),
	]);
}

function describePreferences(preferences: FooterPreferences, knownItems: string[]): string {
	const order = preferences.order.length > 0 ? preferences.order.join(", ") : "default";
	const placements = knownItems.map((id) => `${id}:${getPlacement(preferences, id)}`).join(", ");
	return `order=${order}; placements=${placements || "default"}`;
}

function getOpenRouterStatusText(ctx: ExtensionContext, stats: OpenRouterStats): string {
	const theme = ctx.ui.theme;

	if (stats.available) {
		const usageText = stats.totalUsage !== undefined ? `used ${formatMoney(stats.totalUsage)}` : undefined;
		const remainingText = stats.remainingCredits !== undefined ? `left ${formatMoney(stats.remainingCredits)}` : undefined;
		return theme.fg("success", joinParts(["OpenRouter", usageText, remainingText], " "));
	}

	if (!stats.lastUpdated) {
		return theme.fg("muted", "OpenRouter syncing...");
	}

	return theme.fg("warning", "OpenRouter unavailable");
}

function moveItem(ids: string[], from: number, to: number): string[] {
	if (from === to || from < 0 || to < 0 || from >= ids.length || to >= ids.length) return ids;
	const next = [...ids];
	const [item] = next.splice(from, 1);
	next.splice(to, 0, item);
	return next;
}

function formatPlacementLabel(theme: ExtensionContext["ui"]["theme"], placement: FooterPlacement): string {
	if (placement === "top") return theme.fg("success", "[top]");
	if (placement === "bottom") return theme.fg("warning", "[bottom]");
	return theme.fg("muted", "[hidden]");
}

export default function (pi: ExtensionAPI) {
	let stats: OpenRouterStats = { available: false, error: "Waiting for first refresh" };
	let refreshTimer: ReturnType<typeof setInterval> | undefined;
	let refreshInFlight: Promise<void> | undefined;
	let activeTui: { requestRender: () => void } | undefined;
	let sessionCtx: ExtensionContext | undefined;
	let footerPreferences: FooterPreferences = { ...DEFAULT_FOOTER_PREFERENCES };
	let lastSeenFooterItems: string[] = [...BUILTIN_FOOTER_ITEMS];

	const requestRender = () => activeTui?.requestRender();

	const syncOpenRouterStatus = (ctx: ExtensionContext) => {
		ctx.ui.setStatus("openrouter", getOpenRouterStatusText(ctx, stats));
		requestRender();
	};

	const savePreferences = () => {
		persistPreferences(pi, footerPreferences);
		requestRender();
	};

	const refreshStats = async () => {
		if (refreshInFlight) return refreshInFlight;

		refreshInFlight = (async () => {
			stats = await fetchOpenRouterStats();
			if (sessionCtx?.hasUI) syncOpenRouterStatus(sessionCtx);
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

	const openFooterEditor = async (ctx: ExtensionContext) => {
		const knownItems = getKnownFooterItems(footerPreferences, lastSeenFooterItems);
		const result = await ctx.ui.custom<FooterPreferences | undefined>((tui, theme, _kb, done) => {
			let order = dedupe([...footerPreferences.order, ...knownItems]);
			let placement: Record<string, FooterPlacement> = { ...footerPreferences.placement };
			let index = 0;
			let cached: string[] | undefined;

			const refresh = () => {
				cached = undefined;
				tui.requestRender();
			};

			const reset = () => {
				order = [...knownItems];
				placement = {};
				index = 0;
				refresh();
			};

			return {
				invalidate() {
					cached = undefined;
				},
				handleInput(data: string) {
					if (matchesKey(data, Key.escape)) {
						done(undefined);
						return;
					}

					if (matchesKey(data, Key.enter)) {
						done(normalizePreferences({ order, placement }));
						return;
					}

					if (matchesKey(data, Key.up)) {
						index = Math.max(0, index - 1);
						refresh();
						return;
					}

					if (matchesKey(data, Key.down)) {
						index = Math.min(order.length - 1, index + 1);
						refresh();
						return;
					}

					if (data === "k" && order.length > 1) {
						const nextIndex = Math.max(0, index - 1);
						order = moveItem(order, index, nextIndex);
						index = nextIndex;
						refresh();
						return;
					}

					if (data === "j" && order.length > 1) {
						const nextIndex = Math.min(order.length - 1, index + 1);
						order = moveItem(order, index, nextIndex);
						index = nextIndex;
						refresh();
						return;
					}

					const currentId = order[index];
					if (!currentId) return;

					if (data === "1") {
						placement[currentId] = "top";
						refresh();
						return;
					}

					if (data === "2") {
						placement[currentId] = "bottom";
						refresh();
						return;
					}

					if (data === "0" || data === "h") {
						placement[currentId] = "hidden";
						refresh();
						return;
					}

					if (data === "r") {
						reset();
					}
				},
				render(width: number): string[] {
					if (cached) return cached;

					const lines: string[] = [];
					const add = (text = "") => lines.push(truncateToWidth(text, width));
					const top = order.filter((id) => getPlacement({ order, placement }, id) === "top");
					const bottom = order.filter((id) => getPlacement({ order, placement }, id) === "bottom");
					const hidden = order.filter((id) => getPlacement({ order, placement }, id) === "hidden");

					add(theme.fg("accent", "Footer Layout Editor"));
					add(theme.fg("dim", "↑↓ select • j/k move • 1 top • 2 bottom • 0 hide • r reset • Enter save • Esc cancel"));
					add(theme.fg("dim", "Built-in left side remains cwd/session; this editor controls the right-side footer items."));
					add();

					for (let i = 0; i < order.length; i++) {
						const id = order[i];
						const selected = i === index;
						const marker = selected ? theme.fg("accent", "› ") : "  ";
						const label = selected ? theme.fg("accent", id) : theme.fg("text", id);
						add(`${marker}${formatPlacementLabel(theme, getPlacement({ order, placement }, id))} ${label}`);
					}

					add();
					add(theme.fg("muted", `Top:    ${top.join(", ") || "(none)"}`));
					add(theme.fg("muted", `Bottom: ${bottom.join(", ") || "(none)"}`));
					add(theme.fg("muted", `Hidden: ${hidden.join(", ") || "(none)"}`));

					cached = lines;
					return lines;
				},
			};
		});

		if (!result) return;
		footerPreferences = result;
		savePreferences();
		ctx.ui.notify("Footer layout updated", "success");
	};

	const footerCommandHandler = async (args: string, ctx: ExtensionContext) => {
		const parts = (args || "").trim().split(/\s+/).filter(Boolean);
		const [action, ...rest] = parts;
		const knownItems = getKnownFooterItems(footerPreferences, lastSeenFooterItems);

		if (!action || action === "status") {
			ctx.ui.notify(`Footer: ${describePreferences(footerPreferences, knownItems)}. Use /footer edit for the TUI editor.`, "info");
			return;
		}

		if (action === "edit") {
			if (!ctx.hasUI) {
				ctx.ui.notify("Footer editor requires the interactive TUI", "warning");
				return;
			}
			await openFooterEditor(ctx);
			return;
		}

		if (action === "layout") {
			const layout = rest[0]?.toLowerCase();
			if (layout !== "inline" && layout !== "stacked") {
				ctx.ui.notify("Usage: /footer layout [inline|stacked]", "info");
				return;
			}

			const placement = { ...footerPreferences.placement };
			for (const id of knownItems) {
				placement[id] = layout === "inline" ? "top" : ["model", "context"].includes(id) ? "top" : "bottom";
			}
			footerPreferences = normalizePreferences({ order: footerPreferences.order, placement });
			savePreferences();
			ctx.ui.notify(`Footer layout set to ${layout}`, "success");
			return;
		}

		if (action === "order") {
			const rawOrder = rest.join(" ");
			if (!rawOrder) {
				ctx.ui.notify("Usage: /footer order guardrails,openrouter,model,context", "info");
				return;
			}

			if (["clear", "default", "reset"].includes(rawOrder.toLowerCase())) {
				footerPreferences = normalizePreferences({ placement: footerPreferences.placement });
				savePreferences();
				ctx.ui.notify("Footer item order reset to default", "success");
				return;
			}

			const order = parseOrderList(rawOrder);
			if (order.length === 0) {
				ctx.ui.notify("Usage: /footer order guardrails,openrouter,model,context", "info");
				return;
			}

			footerPreferences = normalizePreferences({ order, placement: footerPreferences.placement });
			savePreferences();
			ctx.ui.notify(`Footer item order set to: ${order.join(", ")}`, "success");
			return;
		}

		if (action === "reset") {
			footerPreferences = { ...DEFAULT_FOOTER_PREFERENCES };
			savePreferences();
			ctx.ui.notify("Footer preferences reset", "success");
			return;
		}

		ctx.ui.notify(
			"Usage: /footer [status|edit|layout inline|layout stacked|order <a,b,c>|order reset|reset]",
			"info",
		);
	};

	pi.registerCommand("footer", {
		description: "Control footer layout and ordering",
		handler: footerCommandHandler,
	});

	pi.registerCommand("openrouter-footer", {
		description: "Alias for /footer",
		handler: footerCommandHandler,
	});

	pi.registerCommand("openrouter-footer-refresh", {
		description: "Refresh OpenRouter usage and credit stats",
		handler: async (_args, ctx) => {
			sessionCtx = ctx;
			await refreshStats();
			ctx.ui.notify("OpenRouter status refreshed", "info");
		},
	});

	pi.on("session_start", async (_event, ctx) => {
		if (!ctx.hasUI) return;

		sessionCtx = ctx;
		footerPreferences = loadSavedPreferences(ctx) ?? { ...DEFAULT_FOOTER_PREFERENCES };

		syncOpenRouterStatus(ctx);
		startRefreshTimer();
		void refreshStats();

		ctx.ui.setFooter((tui, theme, footerData) => {
			activeTui = tui;
			const unsub = footerData.onBranchChange(() => tui.requestRender());

			return {
				dispose: unsub,
				invalidate() {},
				render(width: number): string[] {
					const divider = theme.fg("dim", " · ");
					const sessionName = pi.getSessionName();
					const modelLabel = ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : "no model";
					const contextUsage = ctx.getContextUsage();
					const contextWindow = contextUsage?.contextWindow ?? ctx.model?.contextWindow;
					const contextPercent = contextUsage?.percent;
					const contextLabel =
						contextWindow !== undefined
							? contextPercent !== null && contextPercent !== undefined
								? `ctx ${Math.round(contextPercent)}%/${formatTokens(contextWindow)}`
								: `ctx ${formatTokens(contextWindow)}`
							: "ctx ?";

					const left = joinParts(
						[
							theme.fg("dim", formatCwd(ctx.cwd)),
							sessionName ? theme.fg("muted", sessionName) : undefined,
						],
						divider,
					);

					const itemText = new Map<string, string>([
						...Array.from(footerData.getExtensionStatuses().entries()),
						["model", theme.fg("accent", modelLabel)],
						["context", theme.fg("muted", contextLabel)],
					]);

					lastSeenFooterItems = getKnownFooterItems(footerPreferences, [...lastSeenFooterItems, ...itemText.keys()]);

					const orderedIds = sortIds([...itemText.keys()], footerPreferences.order);
					const topParts = orderedIds
						.filter((id) => getPlacement(footerPreferences, id) === "top")
						.map((id) => itemText.get(id))
						.filter((value): value is string => Boolean(value));
					const bottomParts = orderedIds
						.filter((id) => getPlacement(footerPreferences, id) === "bottom")
						.map((id) => itemText.get(id))
						.filter((value): value is string => Boolean(value));

					const lines = wrapRightBlockWithLeft(left, topParts, width, divider);
					if (bottomParts.length > 0) {
						lines.push(...wrapRightAlignedParts(bottomParts, width, divider));
					}

					return lines.length > 0 ? lines : [truncateToWidth(left, width)];
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

	pi.on("session_shutdown", async (_event, ctx) => {
		stopRefreshTimer();
		ctx.ui.setStatus("openrouter", undefined);
		activeTui = undefined;
		sessionCtx = undefined;
	});
}
