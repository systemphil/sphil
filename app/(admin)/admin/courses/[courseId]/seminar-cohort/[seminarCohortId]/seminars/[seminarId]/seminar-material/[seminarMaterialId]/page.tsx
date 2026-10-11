import Editor from "features/editor/components/Editor";
import {
    dbGetMdxByModelId,
    dbGetSeminarAndConnectedById,
} from "lib/database/dbFuncs";
import { Suspense } from "react";

/**
 * Admin-gated and reads per-request data, so there is no static shell to
 * validate. `instant = false` on the admin layout does not cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

async function AdminSeminarMaterialEdit({
    seminarId,
    seminarMaterialId,
}: {
    seminarId: string;
    seminarMaterialId: string;
}) {
    const material = await dbGetMdxByModelId(seminarMaterialId);
    const materialContainer = await dbGetSeminarAndConnectedById({
        id: seminarId,
    });

    if (!material) {
        throw new Error("Lesson Material not found");
    }
    if (!materialContainer) {
        throw new Error("Lesson not found");
    }

    return (
        <Editor
            material={material}
            title={`Seminar ${materialContainer.order}`}
            courseSlug={materialContainer.seminarCohort.course.slug}
        />
    );
}

export default async function AdminSeminarMaterialEditPage({
    params,
}: {
    params: Promise<{
        seminarId: string;
        seminarMaterialId: string;
    }>;
}) {
    const { seminarId, seminarMaterialId } = await params;
    if (!seminarId || !seminarMaterialId) {
        throw new Error("Missing seminarId or seminarMaterialId  params");
    }

    return (
        <Suspense>
            <AdminSeminarMaterialEdit
                seminarId={seminarId}
                seminarMaterialId={seminarMaterialId}
            />
        </Suspense>
    );
}
