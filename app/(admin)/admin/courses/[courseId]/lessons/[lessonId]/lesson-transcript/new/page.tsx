import {
    dbGetLessonAndRelationsById,
    dbUpsertLessonTranscriptById,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export const metadata = {};

/**
 * Intermediate route that creates a new LessonTranscript
 * entry unless it exists and pushes the user to that route.
 * @description Should never display any UI
 */
export default async function AdminLessonTranscriptNew({
    params,
}: {
    params: Promise<{ courseId: string; lessonId: string }>;
}) {
    const { lessonId, courseId } = await params;
    if (typeof lessonId !== "string" || typeof courseId !== "string") {
        throw new Error("missing course or lesson id");
    }

    const lesson = await dbGetLessonAndRelationsById(lessonId);

    if (lesson && lesson.transcript && lesson.transcript.id) {
        // If lessonContent already exists, push to that.
        redirect(
            `/admin/courses/${courseId}/lessons/${lessonId}/lesson-material/${lesson.transcript.id}`
        );
    }
    const newLessonDetails = {
        lessonId: lessonId,
        transcript: "Hello **new transcript!**",
    };

    const newLessonTranscript =
        await dbUpsertLessonTranscriptById(newLessonDetails);

    if (newLessonTranscript && newLessonTranscript.id) {
        // If new LessonContent entry was created successfully, push user to route.
        redirect(
            `/admin/courses/${courseId}/lessons/${lessonId}/lesson-material/${newLessonTranscript.id}`
        );
    }

    return (
        <p>You should never see this message. An error occurred somewhere.</p>
    );
}
