import Editor from "features/editor/components/Editor";
import { errorMessages } from "lib/config/errorMessages";
import {
    dbGetCourseAndDetailsAndLessonsById,
    dbGetMdxByModelId,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

/**
 * Admin-gated and reads per-request data, so there is no static shell to
 * validate. `instant = false` on the admin layout does not cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

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

    return (
        <Editor
            material={editorMaterial}
            title={course.name}
            courseSlug={course.slug}
        />
    );
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
