import {
    dbGetLessonAndRelationsById,
    dbUpsertLessonContentById,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

/**
 * Admin-gated and reads per-request data, so there is no static shell to
 * validate. `instant = false` on the admin layout does not cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

export const metadata = {};

/**
 * Intermediate route that creates a new LessonContent
 * entry unless it exists and pushes the user to that route.
 * @description Should never display any UI
 */
export default async function AdminLessonContentNew({
    params,
}: {
    params: { courseId: string; lessonId: string };
}) {
    const { lessonId, courseId } = await params;
    if (typeof lessonId !== "string" || typeof courseId !== "string") {
        throw new Error("missing course or lesson id");
    }

    const lesson = await dbGetLessonAndRelationsById(lessonId);

    if (lesson?.content?.id) {
        // If lessonContent already exists, push to that.
        redirect(
            `/admin/courses/${courseId}/lessons/${lessonId}/lesson-material/${lesson.content.id}`
        );
    }
    const newLessonDetails = {
        lessonId: lessonId,
        content: "Hello **world**! New content.",
    };

    const newLessonContent = await dbUpsertLessonContentById(newLessonDetails);
    if (newLessonContent?.id) {
        // If new LessonContent entry was created successfully, push user to route.
        redirect(
            `/admin/courses/${courseId}/lessons/${lessonId}/lesson-material/${newLessonContent.id}`
        );
    }

    return (
        <p>You should never see this message. An error occurred somewhere.</p>
    );
}
