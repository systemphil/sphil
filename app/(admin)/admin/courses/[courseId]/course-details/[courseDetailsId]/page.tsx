import Editor from "features/editor/components/Editor";
import { errorMessages } from "lib/config/errorMessages";
import {
    dbGetCourseAndDetailsAndLessonsById,
    dbGetMdxByModelId,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export const metadata = {};
/**
 * Fetches data for CourseDetails and renders the MDX Editor to the UI.
 */
export default async function AdminLessonMaterialEdit({
    params,
}: {
    params: { courseId: string; courseDetailsId: string };
}) {
    const { courseId, courseDetailsId } = await params;

    if (typeof courseDetailsId !== "string") {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    const editorMaterial = await dbGetMdxByModelId(courseDetailsId);
    const course = await dbGetCourseAndDetailsAndLessonsById(courseId);

    if (!editorMaterial) {
        return redirect(`/admin?error=${errorMessages.lessonNotFound}`);
    }
    if (!course) {
        return redirect(`/admin?error=${errorMessages.courseNotFound}`);
    }

    return <Editor material={editorMaterial} title={course.name} />;
}
