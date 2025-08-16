import Editor from "features/editor/components/Editor";
import { errorMessages } from "lib/config/errorMessages";
import {
    dbGetCourseAndDetailsAndLessonsById,
    dbGetMdxByModelId,
    dbGetSeminarCohortAndSeminarsById,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export const metadata = {};
/**
 * Fetches data for CourseDetails and renders the MDX Editor to the UI.
 */
export default async function AdminSeminarCohortMaterialEdit({
    params,
}: {
    params: Promise<{
        courseId: string;
        seminarCohortDetailsId: string;
        seminarCohortId: string;
    }>;
}) {
    const { courseId, seminarCohortDetailsId, seminarCohortId } = await params;

    if (!seminarCohortDetailsId || !courseId || !seminarCohortId) {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    const editorMaterial = await dbGetMdxByModelId(seminarCohortDetailsId);
    const seminarCohort = await dbGetSeminarCohortAndSeminarsById({
        id: seminarCohortId,
    });
    const course = await dbGetCourseAndDetailsAndLessonsById(courseId);

    if (!editorMaterial) {
        return redirect(`/admin?error=${errorMessages.lessonNotFound}`);
    }
    if (!course) {
        return redirect(`/admin?error=${errorMessages.courseNotFound}`);
    }
    if (!seminarCohort) {
        return redirect(`/admin?error=${errorMessages.seminarCohortNotFound}`);
    }

    return (
        <Editor
            material={editorMaterial}
            title={`${course.name} ${seminarCohort.year}`}
        />
    );
}
