"use server";

import { dbUpdateMdxByModelId } from "lib/database/dbFuncs";
import { cacheKeys } from "lib/config/cacheKeys";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { adminProcedure } from "lib/server/actionProcedures";

export const actionUpdateMdxModelById = adminProcedure
    .input(
        z.object({
            id: z.string(),
            content: z.string(),
        })
    )
    .action(async ({ input }) => {
        await dbUpdateMdxByModelId(input);
        revalidatePath("/(admin)/admin", "layout");
        revalidateTag(cacheKeys.allPublicCourses, "max");
        revalidateTag(cacheKeys.allSeminars, "max");
    });
