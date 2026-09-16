"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
    dbCreateAdminDocument,
    dbSetAdminDocumentArchived,
    dbUpdateAdminDocument,
} from "lib/database/dbFuncs";
import { adminProcedure } from "lib/server/actionProcedures";

const title = z.string().trim().min(1, "Title is required").max(200);

export const actionCreateAdminDocument = adminProcedure
    .input(z.object({ title }))
    .action(async ({ ctx, input }) => {
        const document = await dbCreateAdminDocument({
            title: input.title,
            authorId: ctx.user.id,
        });

        revalidatePath("/admin/documents");

        return document;
    });

export const actionUpdateAdminDocument = adminProcedure
    .input(
        z.object({
            id: z.string().min(1),
            title: title.optional(),
            content: z.string().max(1_000_000).optional(),
        })
    )
    .action(async ({ ctx, input }) => {
        const document = await dbUpdateAdminDocument({
            ...input,
            editorId: ctx.user.id,
        });

        revalidatePath("/admin/documents");
        revalidatePath(`/admin/documents/${input.id}`);

        return document;
    });

export const actionSetAdminDocumentArchived = adminProcedure
    .input(z.object({ id: z.string().min(1), archived: z.boolean() }))
    .action(async ({ input }) => {
        const document = await dbSetAdminDocumentArchived(input);

        revalidatePath("/admin/documents");
        revalidatePath(`/admin/documents/${input.id}`);

        return document;
    });
