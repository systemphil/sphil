import Editor from "features/editor/components/Editor";
import {
    dbGetMdxByModelId,
    dbGetSeminarAndConnectedById,
} from "lib/database/dbFuncs";

export const metadata = {};

/**
 * See lessonMaterial path for explanation.
 */
export default async function AdminSeminarMaterialEdit({
    params,
}: {
    params: Promise<{
        courseId: string;
        seminarId: string;
        seminarMaterialId: string;
    }>;
}) {
    const { seminarId, seminarMaterialId } = await params;
    if (!seminarId || !seminarMaterialId) {
        throw new Error("Missing seminarId or seminarMaterialId params");
    }

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
        />
    );
}
