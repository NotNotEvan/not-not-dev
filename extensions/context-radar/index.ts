import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

type RadarLevel = "low" | "moderate" | "high" | "critical";

type RadarSample = {
	timestamp: number;
	tokens: number;
	contextWindow: number;
	percent: number;
};

type RadarState = {
	widgetVisible: boolean;
};

const STATE_ENTRY_TYPE = "context-radar-state";
const MAX_SAMPLES = 12;
const MODERATE_THRESHOLD = 50;
const HIGH_THRESHOLD = 70;
const CRITICAL_THRESHOLD = 85;

function formatTokens(value: number): string {
	if (!Number.isFinite(value)) return "?";
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
	if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
	return `${Math.round(value)}`;
}

function loadSavedState(ctx: ExtensionContext): RadarState | undefined {
	const entries = ctx.sessionManager.getEntries();

	for (let i = entries.length - 1; i >= 0; i--) {
		const entry = entries[i] as {
			type?: string;
			customType?: string;
			data?: Partial<RadarState>;
		};

		if (entry.type !== "custom" || entry.customType !== STATE_ENTRY_TYPE) continue;
		return {
			widgetVisible: entry.data?.widgetVisible ?? false,
		};
	}

	return undefined;
}

function persistState(pi: ExtensionAPI, state: RadarState): void {
	pi.appendEntry(STATE_ENTRY_TYPE, state);
}

function getUsageSnapshot(ctx: ExtensionContext): RadarSample | undefined {
	const usage = ctx.getContextUsage();
	const contextWindow = usage?.contextWindow ?? ctx.model?.contextWindow;
	const tokens = usage?.tokens;

	if (tokens === undefined || contextWindow === undefined || contextWindow <= 0) return undefined;

	const percent = usage?.percent ?? (tokens / contextWindow) * 100;
	return {
		timestamp: Date.now(),
		tokens,
		contextWindow,
		percent,
	};
}

function getRadarLevel(percent: number): RadarLevel {
	if (percent >= CRITICAL_THRESHOLD) return "critical";
	if (percent >= HIGH_THRESHOLD) return "high";
	if (percent >= MODERATE_THRESHOLD) return "moderate";
	return "low";
}

function getLevelColor(level: RadarLevel): "success" | "accent" | "warning" | "error" {
	if (level === "critical") return "error";
	if (level === "high") return "warning";
	if (level === "moderate") return "accent";
	return "success";
}

function getLevelLabel(level: RadarLevel): string {
	if (level === "critical") return "critical";
	if (level === "high") return "high";
	if (level === "moderate") return "building";
	return "healthy";
}

function getNextThreshold(percent: number): string {
	if (percent < MODERATE_THRESHOLD) return `${MODERATE_THRESHOLD}%`;
	if (percent < HIGH_THRESHOLD) return `${HIGH_THRESHOLD}%`;
	if (percent < CRITICAL_THRESHOLD) return `${CRITICAL_THRESHOLD}%`;
	return "now";
}

function getTrend(samples: RadarSample[]): { label: string; short: string; delta: number } {
	if (samples.length < 2) {
		return { label: "new", short: "·", delta: 0 };
	}

	const latest = samples[samples.length - 1];
	const anchor = samples[Math.max(0, samples.length - 4)];
	const delta = latest.percent - anchor.percent;
	const rounded = Math.round(Math.abs(delta));

	if (Math.abs(delta) < 1.5) {
		return { label: "steady", short: "→", delta };
	}
	if (delta >= 8) {
		return { label: "surging", short: `↑${rounded}`, delta };
	}
	if (delta >= 3) {
		return { label: "rising", short: `↗${rounded}`, delta };
	}
	if (delta <= -8) {
		return { label: "dropping", short: `↓${rounded}`, delta };
	}
	return { label: "easing", short: `↘${rounded}`, delta };
}

function getBar(theme: ExtensionContext["ui"]["theme"], percent: number, level: RadarLevel): string {
	const total = 10;
	const filled = Math.max(0, Math.min(total, Math.round((percent / 100) * total)));
	const bar = `${"█".repeat(filled)}${"░".repeat(total - filled)}`;
	return theme.fg(getLevelColor(level), bar);
}

function rightAlign(text: string, width: number): string {
	if (width <= 0) return "";
	const trimmed = truncateToWidth(text, width);
	return `${" ".repeat(Math.max(0, width - visibleWidth(trimmed)))}${trimmed}`;
}

function syncUi(ctx: ExtensionContext, samples: RadarSample[], widgetVisible: boolean): void {
	const theme = ctx.ui.theme;
	const snapshot = samples[samples.length - 1] ?? getUsageSnapshot(ctx);

	if (!snapshot) {
		ctx.ui.setWidget(
			"context-radar",
			widgetVisible
				? (_tui, theme) => ({
					invalidate() {},
					render(width: number): string[] {
						return [rightAlign(theme.fg("muted", "Context radar waiting for usage data..."), width)];
					},
				})
				: undefined,
		);
		return;
	}

	const level = getRadarLevel(snapshot.percent);
	const trend = getTrend(samples);
	const percent = Math.round(snapshot.percent);

	if (!widgetVisible) {
		ctx.ui.setWidget("context-radar", undefined);
		return;
	}

	const widgetLines = [
		`${theme.fg("accent", "Context radar")} ${getBar(theme, snapshot.percent, level)} ${theme.fg(getLevelColor(level), `${percent}%`)}`,
		`${theme.fg("muted", `${formatTokens(snapshot.tokens)} / ${formatTokens(snapshot.contextWindow)} tokens`)}${theme.fg("dim", ` · pressure ${getLevelLabel(level)}`)}`,
		`${theme.fg("muted", `trend ${trend.label}`)}${theme.fg("dim", ` · next threshold ${getNextThreshold(snapshot.percent)}`)}`,
	];
	ctx.ui.setWidget("context-radar", (_tui, _theme) => ({
		invalidate() {},
		render(width: number): string[] {
			return widgetLines.map((line) => rightAlign(line, width));
		},
	}));
}

export default function contextRadarExtension(pi: ExtensionAPI): void {
	let widgetVisible = false;
	let samples: RadarSample[] = [];

	const addSample = (ctx: ExtensionContext) => {
		const snapshot = getUsageSnapshot(ctx);
		if (!snapshot) {
			syncUi(ctx, samples, widgetVisible);
			return;
		}

		const last = samples[samples.length - 1];
		if (!last || last.tokens !== snapshot.tokens || last.contextWindow !== snapshot.contextWindow) {
			samples = [...samples, snapshot].slice(-MAX_SAMPLES);
		}

		syncUi(ctx, samples, widgetVisible);
	};

	const saveAndSync = (ctx: ExtensionContext) => {
		persistState(pi, { widgetVisible });
		syncUi(ctx, samples, widgetVisible);
	};

	pi.registerCommand("context-radar", {
		description: "Show context pressure details and toggle the radar widget",
		handler: async (args, ctx) => {
			const action = (args || "").trim().toLowerCase();
			addSample(ctx);

			if (!action || action === "toggle") {
				widgetVisible = !widgetVisible;
				saveAndSync(ctx);
				ctx.ui.notify(
					widgetVisible ? "Context radar widget shown" : "Context radar widget hidden",
					widgetVisible ? "success" : "info",
				);
				return;
			}

			if (action === "on" || action === "show") {
				widgetVisible = true;
				saveAndSync(ctx);
				ctx.ui.notify("Context radar widget shown", "success");
				return;
			}

			if (action === "off" || action === "hide") {
				widgetVisible = false;
				saveAndSync(ctx);
				ctx.ui.notify("Context radar widget hidden", "info");
				return;
			}

			if (action === "status") {
				const snapshot = samples[samples.length - 1] ?? getUsageSnapshot(ctx);
				if (!snapshot) {
					ctx.ui.notify("Context radar has no usage data yet", "info");
					return;
				}

				const level = getRadarLevel(snapshot.percent);
				const trend = getTrend(samples);
				ctx.ui.notify(
					`Context radar: ${Math.round(snapshot.percent)}% used (${formatTokens(snapshot.tokens)}/${formatTokens(snapshot.contextWindow)}). Pressure is ${getLevelLabel(level)}. Trend is ${trend.label}. Widget is ${widgetVisible ? "visible" : "hidden"}.`,
					level === "critical" ? "warning" : level === "high" ? "warning" : "info",
				);
				return;
			}

			ctx.ui.notify("Usage: /context-radar [toggle|on|off|status]", "info");
		},
	});

	pi.on("session_start", async (_event, ctx) => {
		const saved = loadSavedState(ctx);
		widgetVisible = saved?.widgetVisible ?? false;
		addSample(ctx);
	});

	pi.on("turn_end", async (_event, ctx) => {
		addSample(ctx);
	});

	pi.on("model_select", async (_event, ctx) => {
		samples = [];
		addSample(ctx);
	});

	pi.on("session_shutdown", async (_event, ctx) => {
		ctx.ui.setWidget("context-radar", undefined);
	});
}
