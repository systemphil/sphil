"use server";

import { auth } from "lib/auth/authConfig";
import { dbVerifyUserPurchase } from "lib/database/dbFuncs";
import { z } from "zod";

const inputSchema = z.object({
    userId: z.string(),
    purchasePriceId: z.string(),
});

export async function actionVerifyUserPurchase(
    userId: string,
    purchasePriceId: string
) {
    const session = await auth();

    if (!session?.user) {
        // TODO handle these errors on the frontend
        return { error: "Unauthorized" };
    }

    const parsedInput = inputSchema.safeParse({ userId, purchasePriceId });

    if (!parsedInput.success) {
        // TODO handle these errors on the frontend
        return { error: `Bad request ${parsedInput.error.message}` };
    }

    return await dbVerifyUserPurchase(userId, purchasePriceId);
}
