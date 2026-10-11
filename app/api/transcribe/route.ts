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
            try {
                await EmailService.adminAlert({
                    message: formatTranscriptionFailure(payload, e),
                });
            } catch (emailError) {
                console.error("Failed to send transcription alert:", emailError);
            }
        }

        return new Response("OK");
    } else {
        return new Response(null, { status: 403 });
    }
}

function formatTranscriptionFailure(
    payload: ApiTranscriptionPayload,
    e: unknown
): string {
    const describe = (err: unknown) =>
        err instanceof Error ? (err.stack ?? err.message) : String(err);
    const cause = e instanceof Error && e.cause ? describe(e.cause) : null;

    return [
        `❌ Transcription failed for lesson ${payload.parentId}`,
        `Transcript ID: ${payload.transcriptId ?? "none (new)"}`,
        `File URL: ${payload.fileUrl.split("?")[0]}`,
        "",
        `Error: ${describe(e)}`,
        ...(cause ? ["", `Last attempt error: ${cause}`] : []),
        "",
        "Use the 'Retry transcription' button on the lesson's admin page to try again.",
    ].join("\n");
}
