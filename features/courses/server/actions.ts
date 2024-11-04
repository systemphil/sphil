"use server";

import { validateAdminAccess } from "lib/auth/authFuncs";
import { ctrlCreateOrUpdateCourse } from "lib/server/ctrl";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const inputSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    slug: z.string().toLowerCase(),
    description: z.string(),
    basePrice: z.number().positive(),
    seminarPrice: z.number().positive(),
    dialoguePrice: z.number().positive(),
    imageUrl: z.string().url().nullable(),
    author: z.string().nullable(),
    published: z.boolean(),
    baseAvailability: z.date(),
    seminarAvailability: z.date(),
    dialogueAvailability: z.date(),
});
type ActionUpsertCourseInput = z.infer<typeof inputSchema>;

export async function actionUpsertCourse(input: ActionUpsertCourseInput) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: "Unauthorized" };
    }
    const parsedInput = inputSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: `Bad request ${parsedInput.error.message}` };
    }
    const data = await ctrlCreateOrUpdateCourse(input);
    revalidatePath("/(admin)/admin", "layout");
    revalidateTag("allPublicCurses");
    return { data };
}
