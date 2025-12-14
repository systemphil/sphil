"use server";

import {
    bucketDeleteVideoFile,
    bucketGenerateReadSignedUrl,
    bucketGenerateSignedUploadUrl,
} from "lib/bucket/bucketFuncs";
import {
    dbCreateOrDeleteUserProgress,
    dbCreateSeminar,
    dbCreateSeminarCohort,
    dbDeleteUserProgressForCourse,
    dbGetCourseAndLessonSlugsByLessonId,
    dbGetLessonSlugById,
    dbGetTranscriptIdByLessonId,
    dbReorderLessons,
    dbReorderSeminars,
    dbUpsertLessonById,
} from "lib/database/dbFuncs";
import { cacheKeys } from "lib/config/cacheKeys";
import {
    ctrlCreateOrUpdateCourse,
    ctrlDeleteModelEntry,
    ctrlUpdateSeminarCohortPrices,
    type ModelName,
} from "lib/server/ctrl";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { z } from "zod";
import {
    adminProcedure,
    protectedProcedure,
} from "lib/server/actionProcedures";

export const actionUpsertCourse = adminProcedure
    .input(
        z.object({
            id: z.string().optional(),
            name: z.string(),
            slug: z.string().toLowerCase(),
            description: z.string(),
            basePrice: z.number().positive(),
            seminarPrice: z.number().positive(),
            dialoguePrice: z.number().positive(),
            imageUrl: z.url().nullable(),
            author: z.string().nullable(),
            published: z.boolean(),
            baseAvailability: z.date(),
            seminarAvailability: z.date(),
            dialogueAvailability: z.date(),
            infoboxTitle: z.string().nullable(),
            infoboxDescription: z.string().nullable(),
        })
    )
    .action(async ({ ctx, input }) => {
        const data = await ctrlCreateOrUpdateCourse({
            ...input,
            creatorId: ctx.user.id,
        });

        revalidatePath("/(admin)/admin", "layout");

        if (input.id) {
            updateTag(cacheKeys.keys.course({ courseSlug: input.slug }));
        }

        updateTag(cacheKeys.keys.publicCourses);
        return { ...data };
    });

export const actionUpdateSeminarCohort = adminProcedure
    .input(
        z.object({
            id: z.string(),
            seminarOnlyPrice: z.number().positive(),
            seminarUpgradePrice: z.number().positive(),
            seminarLink: z.string().nullish(),
        })
    )
    .action(async ({ input }) => {
        const data = await ctrlUpdateSeminarCohortPrices(input);
        revalidatePath("/(admin)/admin", "layout");
        updateTag(
            cacheKeys.keys.seminarCohortsByCourseSlug({
                courseSlug: data.course.slug,
            })
        );

        return { ...data };
    });

export type ActionUpdateSeminarCohortInput = Parameters<
    typeof actionUpdateSeminarCohort
>[0];

export const actionUpsertLesson = adminProcedure
    .input(
        z.object({
            id: z.string().optional(),
            name: z.string(),
            slug: z.string().toLowerCase(),
            description: z.string(),
            partId: z.string().optional().nullish(),
            courseId: z.string(),
        })
    )
    .action(async ({ input }) => {
        const data = await dbUpsertLessonById(input);
        revalidatePath("/(admin)/admin", "layout");

        if (input.id) {
            updateTag(
                cacheKeys.keys.lesson({
                    lessonSlug: input.slug,
                    courseSlug: data.course.slug,
                })
            );
        }
        updateTag(cacheKeys.keys.course({ courseSlug: data.course.slug }));

        return { ...data };
    });

export const actionCreateSignedPostUrl = adminProcedure
    .input(
        z.object({
            id: z.string().optional(),
            lessonId: z.string(),
            fileName: z.string(),
        })
    )
    .action(async ({ input }) => {
        const data = await bucketGenerateSignedUploadUrl(input);
        const lessonData = await dbGetCourseAndLessonSlugsByLessonId(
            input.lessonId
        );
        revalidatePath("/(admin)/admin", "layout");
        updateTag(
            cacheKeys.keys.lesson({
                courseSlug: lessonData.course.slug,
                lessonSlug: lessonData.slug,
            })
        );
        return { ...data };
    });

export const actionCreateSignedPostUrlSeminar = adminProcedure
    .input(
        z.object({
            id: z.string().optional(),
            seminarId: z.string(),
            fileName: z.string(),
        })
    )
    .action(async ({ input }) => {
        const data = await bucketGenerateSignedUploadUrl(input);
        revalidatePath("/(admin)/admin", "layout");
        return { ...data };
    });

export const actionCreateSignedReadUrl = protectedProcedure
    .input(
        z.object({
            id: z.string(),
            fileName: z.string(),
        })
    )
    .action(async ({ input }) => {
        const url = await bucketGenerateReadSignedUrl(input);
        return { url };
    });

export const actionDeleteVideoFile = adminProcedure
    .input(
        z.object({
            id: z.string(),
            fileName: z.string(),
        })
    )
    .action(async ({ input }) => {
        await bucketDeleteVideoFile(input);
        return "Successfully deleted";
    });

export const actionDeleteModelEntry = adminProcedure
    .input(
        z.object({
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
        })
    )
    .action(async ({ input }) => {
        const { id } = await ctrlDeleteModelEntry(input);
        revalidatePath("/(admin)/admin", "layout");
        revalidateTag(cacheKeys.keys.EVERYTHING, "max");
        return { id };
    });

export const actionUpdateLessonOrder = adminProcedure
    .input(z.array(z.string()))
    .action(async ({ input }) => {
        await dbReorderLessons({ orderedLessonIds: input });

        revalidatePath("/(admin)/admin", "layout");
        revalidateTag(cacheKeys.keys.EVERYTHING, "max");
        return "Successfully reordered your lessons";
    });

export const actionUpdateSeminarOrder = adminProcedure
    .input(z.array(z.string()))
    .action(async ({ input }) => {
        await dbReorderSeminars({ orderedIds: input });

        revalidatePath("/(admin)/admin", "layout");
        revalidateTag(cacheKeys.keys.seminarsAll, "max");
        return "Successfully reordered your seminars";
    });

export const actionCreateSeminar = adminProcedure
    .input(
        z.object({
            seminarCohortId: z.string(),
        })
    )
    .action(async ({ input }) => {
        const newSeminar = await dbCreateSeminar(input);

        revalidatePath("/(admin)/admin", "layout");
        updateTag(
            cacheKeys.keys.seminarCohortsByCourseSlug({
                courseSlug: newSeminar.seminarCohort.course.slug,
            })
        );
        return {
            seminarId: newSeminar.id,
        };
    });

export const actionCreateSeminarCohort = adminProcedure
    .input(
        z.object({
            courseId: z.string(),
            currentYear: z.number().min(2024).max(2100),
        })
    )
    .action(async ({ input }) => {
        const newSeminar = await dbCreateSeminarCohort(input);

        revalidatePath("/(admin)/admin", "layout");
        updateTag(
            cacheKeys.keys.seminarCohortsByCourseSlug({
                courseSlug: newSeminar.course.slug,
            })
        );
        return {
            seminarId: newSeminar.id,
        };
    });

export type ApiTranscriptionPayload = {
    parentId: string;
    fileUrl: string;
    transcriptId: string | null;
};

export const actionCreateTranscription = adminProcedure
    .input(
        z.object({
            parentId: z.string(),
            fileUrl: z.string(),
        })
    )
    .action(async ({ input }) => {
        const existingTranscriptEntry = await dbGetTranscriptIdByLessonId({
            lessonId: input.parentId,
        });

        const payload = {
            transcriptId: existingTranscriptEntry?.id ?? null,
            ...input,
        } satisfies ApiTranscriptionPayload;

        // Trigger background processing completely outside render
        fetch(`${process.env.NEXT_PUBLIC_SITE_ROOT}/api/transcribe`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "x-internal-key": `${process.env.TRANSCRIBE_API_KEY}`,
            },
        });

        return "Transcription process triggered";
    });

export const actionToggleLessonCompletion = protectedProcedure
    .input(
        z.object({
            lessonId: z.string().min(1).max(120),
            courseId: z.string().min(1).max(120),
        })
    )
    .action(async ({ input, ctx }) => {
        const { lessonId, courseId } = input;
        const { user } = ctx;

        await dbCreateOrDeleteUserProgress({
            lessonId,
            userId: user.id,
        });

        updateTag(
            cacheKeys.keys.userProgressLesson({ userId: user.id, lessonId })
        );
        updateTag(
            cacheKeys.keys.userProgressCourse({ userId: user.id, courseId })
        );

        return "User progress updated";
    });

export const actionCourseProgressReset = protectedProcedure
    .input(z.object({ courseId: z.string().min(1).max(120) }))
    .action(async ({ input, ctx }) => {
        await dbDeleteUserProgressForCourse({
            courseId: input.courseId,
            userId: ctx.user.id,
        });

        updateTag(
            cacheKeys.keys.userProgressCourse({
                userId: ctx.user.id,
                courseId: input.courseId,
            })
        );

        return "Reset successful";
    });

export const actionUpdateSeminarCohortCache = adminProcedure
    .input(
        z.object({
            courseSlug: z.string().min(1).max(120),
        })
    )
    .action(async ({ input }) => {
        updateTag(
            cacheKeys.keys.seminarCohortsByCourseSlug({
                courseSlug: input.courseSlug,
            })
        );

        return "Cache updated";
    });

export const actionUpdateLessonCache = adminProcedure
    .input(
        z.object({
            courseSlug: z.string().min(1).max(120),
            lessonId: z.string().min(1).max(120),
        })
    )
    .action(async ({ input }) => {
        const lesson = await dbGetLessonSlugById({ id: input.lessonId });
        updateTag(
            cacheKeys.keys.lesson({
                lessonSlug: lesson.slug,
                courseSlug: input.courseSlug,
            })
        );

        return "Cache updated";
    });
