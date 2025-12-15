import { EmailService } from "lib/email/EmailService";
import { cacheKeys } from "lib/config/cacheKeys";
import { processTranscription } from "lib/transcribe/transcribeFuncs";
import { revalidatePath, revalidateTag } from "next/cache";
import type { ApiTranscriptionPayload } from "features/courses/server/actions";
import { dbGetCourseAndLessonSlugByLessonId } from "lib/database/dbFuncs";

export async function POST(req: Request) {
    const authHeader = req.headers.get("x-internal-key");

    if (authHeader === process.env.TRANSCRIBE_API_KEY) {
        const payload = (await req.json()) as ApiTranscriptionPayload;

        try {
            await processTranscription(payload);

            const lesson = await dbGetCourseAndLessonSlugByLessonId({
                id: payload.parentId,
            });
            revalidatePath("/(admin)/admin", "layout");

            if (lesson) {
                revalidateTag(
                    cacheKeys.keys.lesson({
                        courseSlug: lesson.course.slug,
                        lessonSlug: lesson.slug,
                    }),
                    "max"
                );
            }
        } catch (e) {
            console.error("Transcription failed:", e);
            EmailService.adminAlert({ message: e });
        }

        return new Response("OK");
    } else {
        return new Response(null, { status: 403 });
    }
}
