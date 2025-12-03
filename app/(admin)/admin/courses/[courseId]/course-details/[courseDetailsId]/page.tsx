import Editor from "features/editor/components/Editor";
import { errorMessages } from "lib/config/errorMessages";
import {
    dbGetCourseAndDetailsAndLessonsById,
    dbGetMdxByModelId,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function AdminLessonMaterialEdit({
    courseId,
    courseDetailsId,
}: {
    courseId: string;
    courseDetailsId: string;
}) {
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

export default async function AdminLessonMaterialEditPage({
    params,
}: {
    params: Promise<{ courseId: string; courseDetailsId: string }>;
}) {
    const { courseId, courseDetailsId } = await params;

    if (typeof courseDetailsId !== "string") {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    return (
        <Suspense>
            <AdminLessonMaterialEdit
                courseDetailsId={courseDetailsId}
                courseId={courseId}
            />
        </Suspense>
    );
}
