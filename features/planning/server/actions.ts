"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
    dbCreatePlanningItem,
    dbDeletePlanningItem,
    dbUpdatePlanningItem,
} from "lib/database/dbFuncs";
import { adminProcedure } from "lib/server/actionProcedures";
import { PLANNING_ITEM_COLORS, PLANNING_ITEM_STATUSES } from "../types";

/**
 * Days travel as `YYYY-MM-DD` rather than Date objects so the client's
 * timezone can never shift a bar by a day.
 */
const day = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Dates must be YYYY-MM-DD");

const itemFields = z.object({
    title: z.string().trim().min(1, "Title is required").max(200),
    description: z.string().max(20_000),
    startDate: day,
    endDate: day,
    status: z.enum(PLANNING_ITEM_STATUSES),
    color: z.enum(PLANNING_ITEM_COLORS),
    assigneeId: z.string().min(1).nullable(),
});

export const actionCreatePlanningItem = adminProcedure
    .input(
        itemFields.refine((v) => v.endDate >= v.startDate, {
            message: "End date cannot be before start date",
            path: ["endDate"],
        })
    )
    .action(async ({ input }) => {
        const item = await dbCreatePlanningItem(input);

        revalidatePath("/admin/planning");

        return item;
    });

/** Partial updates; dbUpdatePlanningItem checks date order against the merged item. */
export const actionUpdatePlanningItem = adminProcedure
    .input(
        z.object({
            id: z.string().min(1),
            data: itemFields.partial(),
        })
    )
    .action(async ({ input }) => {
        const item = await dbUpdatePlanningItem(input);

        revalidatePath("/admin/planning");

        return item;
    });

export const actionDeletePlanningItem = adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .action(async ({ input }) => {
        const item = await dbDeletePlanningItem(input);

        revalidatePath("/admin/planning");

        return item;
    });
