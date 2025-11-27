import {
    dbGetCourseAndDetailsAndLessonsById,
    dbUpsertCourseDetailsById,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export const metadata = {};
/**
 * Intermediate route that creates a new CourseDetails entry unless it exists and pushes the user to that route.
 * @description Should never display any UI
 */
export default async function AdminCourseDetailsNew({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const courseId = (await params).courseId;
    if (typeof courseId !== "string") {
        throw new Error("missing course or lesson id");
    }

    const course = await dbGetCourseAndDetailsAndLessonsById(courseId);

    if (course?.details?.id) {
        // If CourseDetails already exists, go to that.
        redirect(
            `/admin/courses/${courseId}/course-details/${course.details.id}`
        );
    }
    const newCourseDetails = {
        courseId: courseId,
        content: String(`Hello **new course details for ${course?.name}!**`),
    };

    const result = await dbUpsertCourseDetailsById(newCourseDetails);

    if (result?.id) {
        // If new LessonContent entry was created successfully, push user to route.
        redirect(`/admin/courses/${courseId}/course-details/${result.id}`);
    }

    return (
        <p>You should never see this message. An error occurred somewhere.</p>
    );
}
