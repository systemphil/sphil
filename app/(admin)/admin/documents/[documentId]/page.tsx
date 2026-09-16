import { notFound } from "next/navigation";
import { dbGetAdminDocumentById } from "lib/database/dbFuncs";
import { DocumentEditor } from "features/documents/components/DocumentEditor";

export const metadata = {};

/**
 * Reads admin-gated data per request; see the note on the documents list page.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

export default async function AdminDocumentPage({
    params,
}: {
    params: Promise<{ documentId: string }>;
}) {
    const { documentId } = await params;
    const document = await dbGetAdminDocumentById({ id: documentId });

    if (!document) {
        return notFound();
    }

    return (
        <DocumentEditor
            // Remount on navigation between documents so editor state resets.
            key={document.id}
            document={{
                id: document.id,
                title: document.title,
                content: document.content,
                updatedAt: document.updatedAt.toISOString(),
                archivedAt: document.archivedAt?.toISOString() ?? null,
                lastEditor: document.lastEditor,
            }}
        />
    );
}
