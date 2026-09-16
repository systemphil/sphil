import type { DayString } from "../types";

/**
 * Planning dates are calendar days with no time or zone. Internally they are
 * handled as integer day numbers (days since the Unix epoch, in UTC) so
 * arithmetic is plain addition and never trips over DST.
 */

const MS_PER_DAY = 86_400_000;

export function toDayNum(day: DayString): number {
    const [y, m, d] = day.split("-").map(Number);
    return Date.UTC(y, m - 1, d) / MS_PER_DAY;
}

export function fromDayNum(dayNum: number): DayString {
    return new Date(dayNum * MS_PER_DAY).toISOString().slice(0, 10);
}

/** Today in the viewer's own timezone. */
export function todayDayNum(): number {
    const now = new Date();
    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / MS_PER_DAY;
}

export function dayNumToUTCDate(dayNum: number): Date {
    return new Date(dayNum * MS_PER_DAY);
}

export function startOfMonth(dayNum: number): number {
    const d = dayNumToUTCDate(dayNum);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) / MS_PER_DAY;
}

export function addMonths(dayNum: number, months: number): number {
    const d = dayNumToUTCDate(dayNum);
    return (
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1) / MS_PER_DAY
    );
}

/** 0 = Monday … 6 = Sunday. */
export function weekday(dayNum: number): number {
    return (dayNumToUTCDate(dayNum).getUTCDay() + 6) % 7;
}

export function formatDay(
    dayNum: number,
    options: Intl.DateTimeFormatOptions
): string {
    return dayNumToUTCDate(dayNum).toLocaleDateString(undefined, {
        ...options,
        timeZone: "UTC",
    });
}
