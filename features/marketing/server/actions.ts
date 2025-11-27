"use server";

import { dbCreateNewsletterEmail } from "lib/database/dbFuncs";
import { z } from "zod";

const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export type SubscriptionResponse = {
    success: boolean;
    message: string;
};

export async function actionSubscribeToNewsletter(
    email: string
): Promise<SubscriptionResponse> {
    try {
        const parsedInput = emailSchema.safeParse({ email });

        if (!parsedInput.success) {
            return {
                success: false,
                message: "Invalid email address",
            };
        }

        await dbCreateNewsletterEmail({ email });

        return {
            success: true,
            message: "Successfully subscribed!",
        };
    } catch {
        return {
            success: false,
            message: "Email may already be subscribed",
        };
    }
}
