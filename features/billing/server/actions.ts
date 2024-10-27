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
        throw new Error("User not authenticated");
    }

    const parsedInput = inputSchema.safeParse({ userId, purchasePriceId });

    if (!parsedInput.success) {
        throw new Error("Invalid input: " + parsedInput.error.message);
    }

    return await dbVerifyUserPurchase(userId, purchasePriceId);
}
