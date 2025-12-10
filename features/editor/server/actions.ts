"use server";

import { validateAdminAccess } from "lib/auth/authFuncs";
import { dbUpdateMdxByModelId } from "lib/database/dbFuncs";
import { cacheKeys } from "lib/config/cacheKeys";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const inputSchema = z.object({
    id: z.string(),
    content: z.string(),
});
type ActionUpdateMdxModelByIdInput = z.infer<typeof inputSchema>;

export async function actionUpdateMdxModelById(
    input: ActionUpdateMdxModelByIdInput
) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: "Unauthorized" };
    }
    const parsedInput = inputSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: `Bad request ${parsedInput.error.message}` };
    }
    const data = await dbUpdateMdxByModelId(input);
    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allPublicCourses, "max");
    revalidateTag(cacheKeys.allSeminars, "max");
    return { data };
}
