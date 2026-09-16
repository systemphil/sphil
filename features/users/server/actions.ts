"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cacheKeys } from "lib/config/cacheKeys";
import { z } from "zod";
import {
    dbGrantCourse,
    dbGrantSeminarCohort,
    dbRevokeCourseGrant,
    dbRevokeSeminarCohortGrant,
    dbUpdateUserRole,
} from "lib/database/dbFuncs";
import { superAdminProcedure } from "lib/server/actionProcedures";

export const actionUpdateUserRole = superAdminProcedure
    .input(
        z.object({
            userId: z.string().min(1),
            role: z.enum(["BASIC", "ADMIN", "SUPERADMIN"]),
        })
    )
    .action(async ({ ctx, input }) => {
        /**
         * Blocking self-edits keeps the acting super admin's own role intact,
         * which in turn guarantees at least one super admin always remains and
         * that nobody can lock themselves out of this page.
         */
        if (input.userId === ctx.user.id) {
            throw new Error(
                "You cannot change your own role. Ask another super admin to do it."
            );
        }

        const user = await dbUpdateUserRole(input);

        revalidatePath("/admin/users");

        return user;
    });

const courseGrantInput = z.object({
    userId: z.string().min(1),
    courseId: z.string().min(1),
});

const seminarGrantInput = z.object({
    userId: z.string().min(1),
    seminarCohortId: z.string().min(1),
});

export const actionGrantCourse = superAdminProcedure
    .input(courseGrantInput)
    .action(async ({ ctx, input }) => {
        const grant = await dbGrantCourse({ ...input, grantedById: ctx.user.id });
        revalidatePath("/admin/users");
        return grant;
    });

export const actionRevokeCourseGrant = superAdminProcedure
    .input(courseGrantInput)
    .action(async ({ input }) => {
        const revoked = await dbRevokeCourseGrant(input);
        revalidatePath("/admin/users");
        return revoked;
    });

export const actionGrantSeminarCohort = superAdminProcedure
    .input(seminarGrantInput)
    .action(async ({ ctx, input }) => {
        const grant = await dbGrantSeminarCohort({
            ...input,
            grantedById: ctx.user.id,
        });
        // Seminar pages read participation through "use cache" functions.
        updateTag(
            cacheKeys.keys.seminarCohortsByCourseSlug({
                courseSlug: grant.courseSlug,
            })
        );
        revalidatePath("/admin/users");
        return grant;
    });

export const actionRevokeSeminarCohortGrant = superAdminProcedure
    .input(seminarGrantInput)
    .action(async ({ input }) => {
        const revoked = await dbRevokeSeminarCohortGrant(input);
        // Without this a removed participant keeps cached access for weeks.
        updateTag(
            cacheKeys.keys.seminarCohortsByCourseSlug({
                courseSlug: revoked.courseSlug,
            })
        );
        revalidatePath("/admin/users");
        return revoked;
    });
