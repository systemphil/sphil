"use client";

/* cSpell:disable */

import React, { createContext, useContext, useState } from "react";
import {
    AdmonitionDirectiveDescriptor,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    Button,
    ChangeAdmonitionType,
    ChangeCodeMirrorLanguage,
    CodeToggle,
    ConditionalContents,
    CreateLink,
    DiffSourceToggleWrapper,
    type EditorInFocus,
    GenericJsxEditor,
    InsertAdmonition,
    InsertCodeBlock,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    type JsxComponentDescriptor,
    ListsToggle,
    MDXEditor,
    type MDXEditorMethods,
    Separator,
    ShowSandpackInfo,
    TooltipWrap,
    UndoRedo,
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
    directivesPlugin,
    frontmatterPlugin,
    headingsPlugin,
    imagePlugin,
    jsxPlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
} from "@mdxeditor/editor";
import toast from "react-hot-toast";
import type { dbGetMdxByModelId } from "lib/database/dbFuncs";
import { Heading } from "lib/components/ui/Heading";
import { Loading } from "lib/components/animations/Loading";
import { actionUploadImage } from "lib/server/actions";
import { sleep } from "lib/utils";
import { actionUpdateMdxModelById } from "../server/actions";
import { ButtonInsertYouTube } from "./ButtonInsertYouTube";
import { ButtonInsertTeacherProfile } from "./ButtonInsertTeacherProfile";

/**
 * Context to hold the state of mutation loading as passing props did not work with the MDXEditor Toolbar.
 */
const EditorContext = createContext(false);

export type EditorProps = {
    material: Awaited<ReturnType<typeof dbGetMdxByModelId>>;
    title: string;
    courseSlug: string;
};
/**
 * MDX Editor that allows live, rich text editing of markdown files on the client.
 * Renders only on Clientside through Next's dynamic import and a forwardRef wrapping so
 * that useRef hook properly is passed down to the function.
 * @param props includes MDX string and title string
 */
export default function EditorInternals({
    material,
    title,
    courseSlug,
}: EditorProps) {
    const editorRef = React.useRef<MDXEditorMethods>(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Custom JSX components used in Markdown must be registered here.
     */
    const jsxComponentDescriptors: JsxComponentDescriptor[] = [
        {
            name: "EmbedYT",
            kind: "text",
            props: [{ name: "src", type: "string" }],
            hasChildren: true,
            Editor: GenericJsxEditor,
        },
        {
            name: "EmbedTeacherProfile",
            kind: "text",
            props: [{ name: "teacher", type: "string" }],
            hasChildren: true,
            Editor: GenericJsxEditor,
        },
    ];

    const handleSave = async () => {
        const markdownValue = editorRef.current?.getMarkdown();
        if (!markdownValue) {
            console.error("No markdown value in handleSave", markdownValue);
            toast.error(
                "No markdown value in handleSave. See console (F12) for details"
            );
            return;
        }
        setIsLoading(true);
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
        setIsLoading(false);
    };

    const handleSelectedFileImageUpload = async (file: File) => {
        if (!file) {
            toast.error("No file selected");
            throw new Error("No file selected");
        }
        const body = new FormData();
        body.set("image", file);

        const resp = await actionUploadImage(body);
        if (resp.error || !resp.data) {
            toast.error(`Error uploading profile image ${resp.error}`);
            throw new Error(`Error uploading profile image ${resp.error}`);
        }
        const imageUrl = resp.data.imageUrl;
        toast.success("Image uploaded!");
        await sleep(2000);
        return imageUrl;
    };

    return (
        <div className="p-4">
            <Heading as="h5">
                Editing {material.mdxCategory.toLowerCase()} of &quot;
                <span className="italic">{title}</span>&nbsp;&quot;
            </Heading>
            <EditorContext.Provider value={isLoading}>
                <MDXEditor
                    className="border-2 border-gray-200 rounded-lg full-demo-mdxeditor min-h-screen"
                    ref={editorRef}
                    markdown={material.mdx}
                    contentEditableClassName="!prose dark:!prose-invert !max-w-none"
                    plugins={[
                        jsxPlugin({ jsxComponentDescriptors }),
                        listsPlugin(),
                        quotePlugin(),
                        headingsPlugin(),
                        linkPlugin(),
                        linkDialogPlugin(),
                        imagePlugin(),
                        tablePlugin(),
                        thematicBreakPlugin(),
                        frontmatterPlugin(),
                        codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
                        // codeBlockPlugin({ codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor] }),
                        imagePlugin({
                            imageUploadHandler: handleSelectedFileImageUpload,
                        }),
                        codeMirrorPlugin({
                            codeBlockLanguages: {
                                js: "JavaScript",
                                css: "CSS",
                                txt: "text",
                                tsx: "TypeScript",
                            },
                        }),
                        directivesPlugin({
                            directiveDescriptors: [
                                AdmonitionDirectiveDescriptor,
                            ],
                        }),
                        diffSourcePlugin({
                            diffMarkdown:
                                material.mdx ??
                                "No differences to show. Ignore this.",
                            readOnlyDiff: true,
                            viewMode: "rich-text",
                        }),
                        markdownShortcutPlugin(),
                        toolbarPlugin({
                            toolbarContents: () => (
                                <DefaultToolbar
                                    handleSave={handleSave}
                                    handleGetMarkdown={() =>
                                        console.info(
                                            editorRef.current?.getMarkdown()
                                        )
                                    }
                                />
                            ),
                        }),
                    ]}
                />
            </EditorContext.Provider>
        </div>
    );
}

type DefaultToolbarProps = {
    handleSave: () => void;
    handleGetMarkdown: () => void;
};
const DefaultToolbar: React.FC<DefaultToolbarProps> = ({
    handleSave,
    handleGetMarkdown,
}) => {
    const isLoading = useContext(EditorContext);

    const handleSaveButton = () => {
        handleSave();
    };

    return (
        <DiffSourceToggleWrapper>
            <ConditionalContents
                options={[
                    {
                        when: (editor) => editor?.editorType === "codeblock",
                        contents: () => <ChangeCodeMirrorLanguage />,
                    },
                    {
                        when: (editor) => editor?.editorType === "sandpack",
                        contents: () => <ShowSandpackInfo />,
                    },
                    {
                        fallback: () => (
                            <>
                                <TooltipWrap title="Save to database">
                                    <div className="w-[29px] h-[32px]">
                                        {isLoading ? (
                                            <Loading.RingXs />
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    handleSaveButton()
                                                }
                                            >
                                                💾
                                            </Button>
                                        )}
                                    </div>
                                </TooltipWrap>
                                <UndoRedo />
                                <Separator />
                                <BoldItalicUnderlineToggles />
                                <CodeToggle />
                                <Separator />
                                <ListsToggle />
                                <Separator />

                                <ConditionalContents
                                    options={[
                                        {
                                            when: whenInAdmonition,
                                            contents: () => (
                                                <ChangeAdmonitionType />
                                            ),
                                        },
                                        { fallback: () => <BlockTypeSelect /> },
                                    ]}
                                />

                                <Separator />

                                <CreateLink />
                                <InsertImage />

                                <Separator />

                                <InsertTable />
                                <InsertThematicBreak />

                                <Separator />
                                <InsertCodeBlock />

                                <ConditionalContents
                                    options={[
                                        {
                                            when: (editorInFocus) =>
                                                !whenInAdmonition(
                                                    editorInFocus
                                                ),
                                            contents: () => (
                                                <>
                                                    <Separator />
                                                    <InsertAdmonition />
                                                </>
                                            ),
                                        },
                                    ]}
                                />

                                <ButtonInsertTeacherProfile />
                                <ButtonInsertYouTube />

                                <Separator />
                                <TooltipWrap title="Debug: Print to console">
                                    <Button
                                        onClick={() => handleGetMarkdown?.()}
                                    >
                                        🔧
                                    </Button>
                                </TooltipWrap>

                                {/* <InsertFrontmatter /> */}
                            </>
                        ),
                    },
                ]}
            />
        </DiffSourceToggleWrapper>
    );
};

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
    const node = editorInFocus?.rootNode;
    if (!node || node.getType() !== "directive") {
        return false;
    }
    return ["note", "tip", "danger", "info", "caution"].includes(
        // @ts-expect-error
        node.getMdastNode().name
    );
}
