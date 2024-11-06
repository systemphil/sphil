import {
    dbGetLessonAndRelationsById,
    dbGetMdxByModelId,
} from "lib/database/dbFuncs";
import dynamic from "next/dynamic";

export const metadata = {};

// FIXME put this in a client component!
const LiveEditor = dynamic(() => import("features/editor/components/Editor"), {
    ssr: false,
});
/**
 * Common route for models LessonContent and LessonTranscript
 * that fetches respective data and renders the MDX Editor to the UI.
 * @description Instead of having two routes, one for LessonContent
 * and LessonTranscript, which would be nearly identical and call
 * the same functions, a common route is implemented that uses a
 * common variable and searches the database by id. This is possible
 * because the id of the entries are guaranteed (by Prisma) to be
 * unique across tables.
 */
export default async function AdminLessonMaterialEdit({
    params,
}: {
    params: { courseId: string; lessonId: string; lessonMaterialId: string };
}) {
    const { lessonId, lessonMaterialId } = await params;
    if (typeof lessonMaterialId !== "string") {
        throw new Error("missing lessonContent id");
    }

    const lessonMaterial = await dbGetMdxByModelId(lessonMaterialId);
    const lesson = await dbGetLessonAndRelationsById(lessonId);

    if (!lessonMaterial) {
        throw new Error("Lesson Material not found");
    }
    if (!lesson) {
        throw new Error("Lesson not found");
    }

    return <LiveEditor material={lessonMaterial} title={lesson.name} />;
}
