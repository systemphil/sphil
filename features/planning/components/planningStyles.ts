import type { CSSProperties } from "react";
import type { PlanningItemColor, PlanningItemStatus } from "../types";

/**
 * MUI menus and drawers are Modals, which lock body scroll by hiding the
 * scrollbar and padding its gap, so the page jars sideways on open and close.
 * Pass as a select TextField's `slotProps`.
 */
export const NO_SCROLL_LOCK_SELECT = {
    select: { MenuProps: { disableScrollLock: true } },
} as const;

/** Literal class strings so Tailwind's scanner picks them up. */
export const COLOR_SWATCH_CLASSES: Record<PlanningItemColor, string> = {
    GRAY: "bg-gray-400",
    RED: "bg-red-400",
    ORANGE: "bg-orange-400",
    YELLOW: "bg-yellow-400",
    GREEN: "bg-green-400",
    BLUE: "bg-blue-400",
    PURPLE: "bg-purple-400",
    PINK: "bg-pink-400",
};

/** Fill and edge per colour, for light and dark themes (Tailwind 300/500 and 700/400). */
const PAINT_VALUES: Record<
    PlanningItemColor,
    [fill: string, edge: string, fillDark: string, edgeDark: string]
> = {
    GRAY: ["#d1d5db", "#6b7280", "#374151", "#9ca3af"],
    RED: ["#fca5a5", "#ef4444", "#b91c1c", "#f87171"],
    ORANGE: ["#fdba74", "#f97316", "#c2410c", "#fb923c"],
    YELLOW: ["#fde047", "#eab308", "#a16207", "#facc15"],
    GREEN: ["#86efac", "#22c55e", "#15803d", "#4ade80"],
    BLUE: ["#93c5fd", "#3b82f6", "#1d4ed8", "#60a5fa"],
    PURPLE: ["#d8b4fe", "#a855f7", "#7e22ce", "#c084fc"],
    PINK: ["#f9a8d4", "#ec4899", "#be185d", "#f472b6"],
};

/**
 * Status is drawn as the fill pattern of a box in the item's colour:
 * hollow = planned, diagonal half = in progress, vertical stripes = blocked,
 * solid = done. `stripe` is the stripe width in px (smaller for tiny swatches).
 */
function statusBackground(status: PlanningItemStatus, stripe: number) {
    switch (status) {
        case "PLANNED":
            return "var(--paint-empty)";
        case "IN_PROGRESS":
            return "linear-gradient(to bottom right, var(--paint-fill) 50%, var(--paint-empty) 50%)";
        case "BLOCKED":
            return `repeating-linear-gradient(90deg, var(--paint-fill) 0 ${stripe}px, var(--paint-empty) ${stripe}px ${stripe * 2}px)`;
        case "DONE":
            return "var(--paint-fill)";
    }
}

/**
 * The colours are set inline as light/dark pairs and this class picks the pair
 * for the active theme, since inline styles can't follow the `.dark` class.
 */
const PAINT_THEME_CLASS =
    "border [--paint-fill:var(--paint-fill-l)] [--paint-edge:var(--paint-edge-l)] [--paint-empty:#ffffff] dark:[--paint-fill:var(--paint-fill-d)] dark:[--paint-edge:var(--paint-edge-d)] dark:[--paint-empty:#171717]";

export function statusPaint({
    color,
    status,
    stripe = 6,
}: {
    color: PlanningItemColor;
    status: PlanningItemStatus;
    stripe?: number;
}): { className: string; style: CSSProperties } {
    const [fill, edge, fillDark, edgeDark] = PAINT_VALUES[color];

    return {
        className: PAINT_THEME_CLASS,
        style: {
            "--paint-fill-l": fill,
            "--paint-edge-l": edge,
            "--paint-fill-d": fillDark,
            "--paint-edge-d": edgeDark,
            borderColor: "var(--paint-edge)",
            background: statusBackground(status, stripe),
        } as CSSProperties,
    };
}

export const STATUS_META: Record<PlanningItemStatus, { label: string }> = {
    PLANNED: { label: "Planned" },
    IN_PROGRESS: { label: "In progress" },
    BLOCKED: { label: "Blocked" },
    DONE: { label: "Done" },
};
