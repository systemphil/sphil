"use server";

import { dbVerifyUserPurchase } from "lib/database/dbFuncs";
import { protectedProcedure } from "lib/server/actionProcedures";
import { z } from "zod";

export const actionVerifyUserPurchase = protectedProcedure
    .input(
        z.object({
            purchasePriceId: z.string(),
        })
    )
    .action(async ({ input, ctx }) => {
        return await dbVerifyUserPurchase(ctx.user.id, input.purchasePriceId);
    });
