import {
    dbGetSeminarCohortAndSeminarsById,
    dbUpsertCourseDetailsById,
    dbUpsertSeminarCohortDetailsById,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export const metadata = {};

/**
 * Intermediate route that creates a new SeminarCohortDetails entry unless it exists and pushes the user to that route.
 * @description Should never display any UI
 */
export default async function AdminSeminarCohortDetailsNew({
    params,
}: {
    params: Promise<{ courseId: string; seminarCohortId: string }>;
}) {
    const { seminarCohortId, courseId } = await params;
    if (!seminarCohortId || !courseId) {
        throw new Error("missing course or lesson id");
    }

    const seminarCohortAndSeminars = await dbGetSeminarCohortAndSeminarsById({
        id: seminarCohortId,
    });

    if (
        seminarCohortAndSeminars &&
        seminarCohortAndSeminars.details &&
        seminarCohortAndSeminars.details.id
    ) {
        // If CourseDetails already exists, go to that.
        redirect(
            `/admin/courses/${courseId}/seminar-cohort/${seminarCohortAndSeminars.id}/seminar-cohort-details/${seminarCohortAndSeminars.details.id}`
        );
    }

    if (!seminarCohortAndSeminars) {
        throw new Error("expected seminarCohort");
    }

    const newCourseDetails = {
        seminarCohortId: seminarCohortId,
        content: String(
            `Hello **new course details for ${seminarCohortAndSeminars?.course.name} ${seminarCohortAndSeminars?.year}!**`
        ),
    };

    const result = await dbUpsertSeminarCohortDetailsById(newCourseDetails);

    if (result && result.id) {
        // If new LessonContent entry was created successfully, push user to route.
        redirect(
            `/admin/courses/${courseId}/seminar-cohort/${seminarCohortAndSeminars.id}/seminar-cohort-details/${result.id}`
        );
    }

    return (
        <p>You should never see this message. An error occurred somewhere.</p>
    );
}
