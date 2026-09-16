"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { dbUpdateUserRole } from "lib/database/dbFuncs";
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
