import type { PlanningItem } from "../types";
import {
    addMonths,
    dayNumToUTCDate,
    formatDay,
    startOfMonth,
    toDayNum,
    weekday,
} from "./days";

export const ZOOMS = ["week", "month", "quarter"] as const;

export type Zoom = (typeof ZOOMS)[number];

const ZOOM_CONFIG: Record<
    Zoom,
    { dayWidth: number; padMonths: number; label: string }
> = {
    week: { dayWidth: 36, padMonths: 1, label: "Week" },
    month: { dayWidth: 14, padMonths: 3, label: "Month" },
    quarter: { dayWidth: 4, padMonths: 9, label: "Quarter" },
};

export const zoomLabel = (zoom: Zoom) => ZOOM_CONFIG[zoom].label;

export type Segment = {
    /** First day (day number) the segment covers. */
    start: number;
    days: number;
    label: string;
    /** Shaded in the grid (weekends at week zoom). */
    muted?: boolean;
};

export type Scale = {
    rangeStart: number;
    /** Exclusive. */
    rangeEnd: number;
    dayWidth: number;
    totalWidth: number;
    top: Segment[];
    bottom: Segment[];
};

function monthStarts(rangeStart: number, rangeEnd: number): number[] {
    const starts: number[] = [];
    for (let m = rangeStart; m < rangeEnd; m = addMonths(m, 1)) {
        starts.push(m);
    }
    return starts;
}

const utcMonth = (dayNum: number) => dayNumToUTCDate(dayNum).getUTCMonth();

/**
 * Lays out the visible date range and its two header tiers. The range always
 * covers today and every item, padded so there is room to drag past either
 * end, and snapped to month (or quarter) boundaries so the top tier is whole.
 * It always runs to at least the end of next year, so there is room to plan
 * ahead even with no items.
 */
export function buildScale(
    items: Pick<PlanningItem, "startDate" | "endDate">[],
    zoom: Zoom,
    today: number
): Scale {
    const { dayWidth, padMonths } = ZOOM_CONFIG[zoom];

    const earliest = Math.min(today, ...items.map((i) => toDayNum(i.startDate)));
    const latest = Math.max(today, ...items.map((i) => toDayNum(i.endDate)));

    let rangeStart = addMonths(startOfMonth(earliest), -padMonths);
    /** Exclusive, like `rangeEnd`: January 1st of the year after next. */
    const endOfNextYear =
        Date.UTC(dayNumToUTCDate(today).getUTCFullYear() + 2, 0, 1) / 86_400_000;
    let rangeEnd = Math.max(
        addMonths(startOfMonth(latest), padMonths + 1),
        endOfNextYear
    );

    if (zoom === "quarter") {
        rangeStart = addMonths(rangeStart, -(utcMonth(rangeStart) % 3));
        rangeEnd = addMonths(rangeEnd, (3 - (utcMonth(rangeEnd) % 3)) % 3);
    }

    const months = monthStarts(rangeStart, rangeEnd);
    const monthSegment = (m: number, label: string): Segment => ({
        start: m,
        days: addMonths(m, 1) - m,
        label,
    });

    let top: Segment[];
    let bottom: Segment[] = [];

    if (zoom === "quarter") {
        top = months
            .filter((m) => utcMonth(m) % 3 === 0)
            .map((m) => ({
                start: m,
                days: addMonths(m, 3) - m,
                label: `Q${utcMonth(m) / 3 + 1} ${dayNumToUTCDate(m).getUTCFullYear()}`,
            }));
        bottom = months.map((m) =>
            monthSegment(m, formatDay(m, { month: "short" }))
        );
    } else {
        top = months.map((m) =>
            monthSegment(m, formatDay(m, { month: "long", year: "numeric" }))
        );

        if (zoom === "week") {
            for (let d = rangeStart; d < rangeEnd; d++) {
                bottom.push({
                    start: d,
                    days: 1,
                    label: formatDay(d, { day: "numeric" }),
                    muted: weekday(d) >= 5,
                });
            }
        } else {
            // Weeks start on Monday; the first one may be clipped by the range.
            let d = rangeStart;
            while (d < rangeEnd) {
                const next = Math.min(rangeEnd, d + 7 - weekday(d));
                bottom.push({
                    start: d,
                    days: next - d,
                    label:
                        weekday(d) === 0 ? formatDay(d, { day: "numeric" }) : "",
                });
                d = next;
            }
        }
    }

    return {
        rangeStart,
        rangeEnd,
        dayWidth,
        totalWidth: (rangeEnd - rangeStart) * dayWidth,
        top,
        bottom,
    };
}
