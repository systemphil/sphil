import type {
    PlanningItemColor as DbPlanningItemColor,
    PlanningItemStatus as DbPlanningItemStatus,
} from "@prisma/client";

/**
 * Client-facing planning types. They mirror the Prisma `PlanningItem` model
 * except that dates are serialised (see lib/database/dbFuncs.ts), so client
 * components never deal with Date objects or timezones.
 */

export const PLANNING_ITEM_STATUSES = [
    "PLANNED",
    "IN_PROGRESS",
    "BLOCKED",
    "DONE",
] as const satisfies readonly DbPlanningItemStatus[];

export type PlanningItemStatus = DbPlanningItemStatus;

export const PLANNING_ITEM_COLORS = [
    "GRAY",
    "RED",
    "ORANGE",
    "YELLOW",
    "GREEN",
    "BLUE",
    "PURPLE",
    "PINK",
] as const satisfies readonly DbPlanningItemColor[];

export type PlanningItemColor = DbPlanningItemColor;

/** A calendar day as `YYYY-MM-DD`, timezone-free. */
export type DayString = string;

export type PlanningItem = {
    id: string;
    title: string;
    description: string;
    startDate: DayString;
    /** Inclusive. */
    endDate: DayString;
    status: PlanningItemStatus;
    color: PlanningItemColor;
    assigneeId: string | null;
    createdAt: string;
    updatedAt: string;
};

export type PlanningItemInput = Pick<
    PlanningItem,
    | "title"
    | "description"
    | "startDate"
    | "endDate"
    | "status"
    | "color"
    | "assigneeId"
>;

export type PlanningAssignee = {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
};
