import Editor from "features/editor/components/Editor";
import {
    dbGetCourseAndDetailsAndLessonsById,
    dbGetMdxByModelId,
} from "lib/database/dbFuncs";

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
        throw new Error("missing lessonContent id");
    }

    const editorMaterial = await dbGetMdxByModelId(courseDetailsId);
    const course = await dbGetCourseAndDetailsAndLessonsById(courseId);

    if (!editorMaterial) {
        throw new Error("CourseDetails not found");
    }
    if (!course) {
        throw new Error("Course not found");
    }

    return <Editor material={editorMaterial} title={course.name} />;
}
