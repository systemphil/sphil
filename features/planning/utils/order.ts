import type { PlanningItem } from "../types";

/**
 * Timeline row order: earliest start first, then earliest end, then oldest.
 * `YYYY-MM-DD` strings sort chronologically as plain strings.
 */
export function comparePlanningItems(
    a: Pick<PlanningItem, "startDate" | "endDate" | "createdAt">,
    b: Pick<PlanningItem, "startDate" | "endDate" | "createdAt">
) {
    return (
        a.startDate.localeCompare(b.startDate) ||
        a.endDate.localeCompare(b.endDate) ||
        a.createdAt.localeCompare(b.createdAt)
    );
}
