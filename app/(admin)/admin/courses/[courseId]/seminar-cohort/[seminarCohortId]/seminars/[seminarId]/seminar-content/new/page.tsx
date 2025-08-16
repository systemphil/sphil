import {
    dbGetSeminarAndConnectedById,
    dbUpsertSeminarContentById,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export const metadata = {};

/**
 * Intermediate route that creates a new SeminarContent
 * entry unless it exists and pushes the user to that route.
 * @description Should never display any UI
 */
export default async function AdminSeminarContentNew({
    params,
}: {
    params: Promise<{
        courseId: string;
        seminarCohortId: string;
        seminarId: string;
    }>;
}) {
    const { courseId, seminarId, seminarCohortId } = await params;
    if (!courseId || !seminarId || !seminarCohortId) {
        throw new Error("missing course, seminarCohort or seminar id");
    }

    const seminar = await dbGetSeminarAndConnectedById({ id: seminarId });

    if (seminar && seminar.content && seminar.content.id) {
        redirect(
            `/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminarId}/seminar-material/${seminar.content.id}`
        );
    }
    const newDetails = {
        seminarId,
        content: "Hello **world**! New content for seminars.",
    };

    const newLessonContent = await dbUpsertSeminarContentById(newDetails);
    if (newLessonContent && newLessonContent.id) {
        redirect(
            `/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminarId}/seminar-material/${newLessonContent.id}`
        );
    }

    return (
        <p>You should never see this message. An error occurred somewhere.</p>
    );
}
