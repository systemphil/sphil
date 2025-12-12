"use server";

import { dbCreateNewsletterEmail } from "lib/database/dbFuncs";
import { publicProcedure } from "lib/server/actionProcedures";
import { z } from "zod";

export type SubscriptionResponse = Awaited<
    ReturnType<typeof actionSubscribeToNewsletter>
>;

export const actionSubscribeToNewsletter = publicProcedure
    .input(
        z.object({
            email: z.email("Invalid email address"),
        })
    )
    .action(async ({ input }) => {
        try {
            await dbCreateNewsletterEmail({ email: input.email });

            return "Successfully subscribed!";
        } catch {
            throw new Error("Email may already be subscribed");
        }
    });
