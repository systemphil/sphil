"use server";

import { auth } from "lib/auth/authConfig";
import { validateAdminAccess } from "lib/auth/authFuncs";
import {
    bucketDeleteVideoFile,
    bucketGenerateReadSignedUrl,
    bucketGenerateSignedUploadUrl,
} from "lib/bucket/bucketFuncs";
import {
    dbCreateSeminar,
    dbCreateSeminarCohort,
    dbGetTranscriptIdByLessonId,
    dbReorderLessons,
    dbReorderSeminars,
    dbUpsertLessonById,
} from "lib/database/dbFuncs";
import { cacheKeys } from "lib/server/cache";
import {
    ctrlCreateOrUpdateCourse,
    ctrlDeleteModelEntry,
    ctrlUpdateSeminarCohortPrices,
    type ModelName,
} from "lib/server/ctrl";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const upsertCourseSchema = z.object({
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
    infoboxTitle: z.string().nullable(),
    infoboxDescription: z.string().nullable(),
});
type ActionUpsertCourseInput = z.infer<typeof upsertCourseSchema>;

export async function actionUpsertCourse(input: ActionUpsertCourseInput) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: "Unauthorized" };
    }
    const parsedInput = upsertCourseSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: `Bad request ${parsedInput.error.message}` };
    }

    const session = await auth();
    const creatorId = session?.user.id;

    if (!creatorId) {
        throw new Error("Failed to retrieve creatorId from session user id");
    }

    const _input = {
        ...input,
        creatorId,
    };

    const data = await ctrlCreateOrUpdateCourse(_input);
    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allPublicCourses);
    return { data };
}

const updateSeminarCohortSchema = z.object({
    id: z.string(),
    seminarOnlyPrice: z.number().positive(),
    seminarUpgradePrice: z.number().positive(),
    seminarLink: z.string().nullish(),
});
export type ActionUpdateSeminarCohortInput = z.infer<
    typeof updateSeminarCohortSchema
>;

export async function actionUpdateSeminarCohort(
    input: ActionUpdateSeminarCohortInput
) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: "Unauthorized" };
    }
    const parsedInput = updateSeminarCohortSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: `Bad request ${parsedInput.error.message}` };
    }

    const data = await ctrlUpdateSeminarCohortPrices(input);
    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allSeminars);

    return { data };
}

const upsertLessonSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    slug: z.string().toLowerCase(),
    description: z.string(),
    partId: z.string().optional().nullish(),
    courseId: z.string(),
});
type ActionUpsertLessonInput = z.infer<typeof upsertLessonSchema>;

export async function actionUpsertLesson(input: ActionUpsertLessonInput) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: "Unauthorized" };
    }
    const parsedInput = upsertLessonSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: `Bad request ${parsedInput.error.message}` };
    }
    const data = await dbUpsertLessonById(input);
    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allPublicCourses);
    return { data };
}

const createSignedPostUrlSchema = z.object({
    id: z.string().optional(),
    lessonId: z.string(),
    fileName: z.string(),
});
type ActionCreateSignedPostUrlInput = z.infer<typeof createSignedPostUrlSchema>;

export async function actionCreateSignedPostUrl(
    input: ActionCreateSignedPostUrlInput
) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: "Unauthorized" };
    }
    const parsedInput = createSignedPostUrlSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: `Bad request ${parsedInput.error.message}` };
    }
    const data = await bucketGenerateSignedUploadUrl(input);
    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allPublicCourses);
    return { data };
}

const createSignedPostUrlSeminarSchema = z.object({
    id: z.string().optional(),
    seminarId: z.string(),
    fileName: z.string(),
});

export async function actionCreateSignedPostUrlSeminar(
    input: z.infer<typeof createSignedPostUrlSeminarSchema>
) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: "Unauthorized" };
    }
    const parsedInput = createSignedPostUrlSeminarSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: `Bad request ${parsedInput.error.message}` };
    }

    const data = await bucketGenerateSignedUploadUrl(input);
    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allPublicCourses);
    return { data };
}

const createSignedReadUrlSchema = z.object({
    id: z.string(),
    fileName: z.string(),
});
type ActionCreateSignedReadUrlInput = z.infer<typeof createSignedReadUrlSchema>;

export async function actionCreateSignedReadUrl(
    input: ActionCreateSignedReadUrlInput
) {
    const parsedInput = createSignedReadUrlSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: `Bad request ${parsedInput.error.message}` };
    }
    const data = await bucketGenerateReadSignedUrl(input);
    return { data };
}

const deleteVideoFileSchema = z.object({
    id: z.string(),
    fileName: z.string(),
});
type ActionDeleteVideoFileInput = z.infer<typeof deleteVideoFileSchema>;

export async function actionDeleteVideoFile(input: ActionDeleteVideoFileInput) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: "Unauthorized" };
    }
    const parsedInput = deleteVideoFileSchema.safeParse(input);

    if (!parsedInput.success) {
        return { error: `Bad request ${parsedInput.error.message}` };
    }
    const data = await bucketDeleteVideoFile(input);
    return { data };
}

const deleteModelEntrySchema = z.object({
    id: z.string(),
    modelName: z.enum([
        "LessonTranscript",
        "LessonContent",
        "Video",
        "CourseDetails",
        "Lesson",
        "Course",
        "SeminarTranscript",
        "SeminarContent",
        "SeminarVideo",
        "Seminar",
        "SeminarCohortDetails",
        "UNSUPPORTED",
    ]) satisfies z.ZodType<ModelName>,
});
type ActionDeleteModelEntryInput = z.infer<typeof deleteModelEntrySchema>;

export async function actionDeleteModelEntry(
    input: ActionDeleteModelEntryInput
) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: "Unauthorized" };
    }
    const parsedInput = deleteModelEntrySchema.safeParse(input);
    if (!parsedInput.success) {
        return { error: `Bad request ${parsedInput.error.message}` };
    }
    const data = await ctrlDeleteModelEntry(input);
    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allPublicCourses);
    return { data };
}

const reorderModelsSchema = z.array(z.string());

export async function actionUpdateLessonOrder(
    input: z.infer<typeof reorderModelsSchema>
) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: true, message: "Unauthorized" };
    }
    const parsedInput = reorderModelsSchema.safeParse(input);
    if (!parsedInput.success) {
        return {
            error: true,
            message: `Bad request ${parsedInput.error.message}`,
        };
    }

    await dbReorderLessons({ orderedLessonIds: input });

    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allPublicCourses);
    return { error: false, message: "Successfully reordered your lessons" };
}

export async function actionUpdateSeminarOrder(
    input: z.infer<typeof reorderModelsSchema>
) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: true, message: "Unauthorized" };
    }
    const parsedInput = reorderModelsSchema.safeParse(input);
    if (!parsedInput.success) {
        return {
            error: true,
            message: `Bad request ${parsedInput.error.message}`,
        };
    }

    await dbReorderSeminars({ orderedIds: input });

    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allSeminars);
    return { error: false, message: "Successfully reordered your seminars" };
}

const actionCreateSeminarSchema = z.object({
    seminarCohortId: z.string(),
});

export async function actionCreateSeminar(
    input: z.infer<typeof actionCreateSeminarSchema>
) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: true, message: "Unauthorized" };
    }
    const parsedInput = actionCreateSeminarSchema.safeParse(input);
    if (!parsedInput.success) {
        return {
            error: true,
            message: `Bad request ${parsedInput.error.message}`,
        };
    }

    const newSeminar = await dbCreateSeminar(input);

    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allSeminars);
    return {
        error: false,
        message: "Successfully created",
        data: {
            seminarId: newSeminar.id,
        },
    };
}

const actionCreateSeminarCohortSchema = z.object({
    courseId: z.string(),
    currentYear: z.number().min(2024).max(2100),
});

export async function actionCreateSeminarCohort(
    input: z.infer<typeof actionCreateSeminarCohortSchema>
) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: true, message: "Unauthorized" };
    }
    const parsedInput = actionCreateSeminarCohortSchema.safeParse(input);
    if (!parsedInput.success) {
        return {
            error: true,
            message: `Bad request ${parsedInput.error.message}`,
        };
    }

    const newSeminar = await dbCreateSeminarCohort(input);

    revalidatePath("/(admin)/admin", "layout");
    revalidateTag(cacheKeys.allSeminars);
    return {
        error: false,
        message: "Successfully created",
        data: {
            seminarId: newSeminar.id,
        },
    };
}

const actionCreateTranscriptionSchema = z.object({
    parentId: z.string(),
    fileUrl: z.string(),
});

export async function actionCreateTranscription(
    input: z.infer<typeof actionCreateTranscriptionSchema>
) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: true, message: "Unauthorized" };
    }

    const parsed = actionCreateTranscriptionSchema.safeParse(input);
    if (!parsed.success) {
        return { error: true, message: parsed.error.message };
    }

    const existingTranscriptEntry = await dbGetTranscriptIdByLessonId({
        lessonId: input.parentId,
    });

    const payload = {
        transcriptId: existingTranscriptEntry?.id ?? null,
        ...input,
    };

    // Trigger background processing completely outside render
    fetch(`${process.env.NEXT_PUBLIC_SITE_ROOT}/api/transcribe`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
            "x-internal-key": `${process.env.TRANSCRIBE_API_KEY}`,
        },
    });

    return {
        error: false,
        message: "Transcription process triggered",
    };
}
