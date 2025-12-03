import {
    dbGetSeminarAndConnectedById,
    dbUpsertSeminarTranscriptById,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export const metadata = {};

/**
 * Intermediate route that creates a new SeminarTranscript
 * entry unless it exists and pushes the user to that route.
 * @description Should never display any UI
 */
export default async function AdminSeminarTranscriptNew({
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

    if (seminar?.transcript?.id) {
        redirect(
            `/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminarId}/seminar-material/${seminar.transcript.id}`
        );
    }

    const newDetails = {
        seminarId,
        content: "Hello **world**! New transcript for seminars.",
    };

    const newSeminarTranscript =
        await dbUpsertSeminarTranscriptById(newDetails);
    if (newSeminarTranscript?.id) {
        redirect(
            `/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminarId}/seminar-material/${newSeminarTranscript.id}`
        );
    }

    return (
        <p>You should never see this message. An error occurred somewhere.</p>
    );
}
