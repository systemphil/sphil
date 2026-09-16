"use client";

import toast from "react-hot-toast";
import type { dbGetMdxByModelId } from "lib/database/dbFuncs";
import { Heading } from "lib/components/ui/Heading";
import { actionUpdateMdxModelById } from "../server/actions";
import MdxEditorCore from "./MdxEditorCore";

export type EditorProps = {
    material: Awaited<ReturnType<typeof dbGetMdxByModelId>>;
    title: string;
    courseSlug: string;
};

/**
 * MDX Editor that allows live, rich text editing of course markdown on the client.
 * Renders only on Clientside through Next's dynamic import (see Editor.tsx).
 * @param props includes MDX string and title string
 */
export default function EditorInternals({
    material,
    title,
    courseSlug,
}: EditorProps) {
    const handleSave = async (markdownValue: string) => {
        if (!markdownValue) {
            console.error("No markdown value in handleSave", markdownValue);
            toast.error(
                "No markdown value in handleSave. See console (F12) for details"
            );
            return;
        }
        const resp = await actionUpdateMdxModelById({
            id: material.id,
            content: markdownValue,
            courseSlug,
        });
        if (resp.error) {
            toast.error(`Error saving ${resp.error}`);
        } else {
            toast.success("Success! Saved to database.");
        }
    };

    return (
        <div className="p-4">
            <Heading as="h5">
                Editing {material.mdxCategory.toLowerCase()} of &quot;
                <span className="italic">{title}</span>&nbsp;&quot;
            </Heading>
            <MdxEditorCore markdown={material.mdx} onSave={handleSave} />
        </div>
    );
}
