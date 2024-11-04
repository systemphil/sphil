"use client";

import React, { createContext, useContext } from "react";
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
    EditorInFocus,
    InsertAdmonition,
    InsertCodeBlock,
    InsertFrontmatter,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    ListsToggle,
    MDXEditor,
    MDXEditorMethods,
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
import { dbGetMdxByModelId } from "lib/database/dbFuncs";
import { Heading } from "lib/components/ui/Heading";
import { Loading } from "lib/components/animations/Loading";
import { actionUploadImage } from "lib/server/actions";
import { sleep } from "lib/utils";

/**
 * Context to hold the state of mutation loading as passing props did not work with the MDXEditor Toolbar.
 */
const EditorContext = createContext(false);

export type EditorProps = {
    material: Awaited<ReturnType<typeof dbGetMdxByModelId>>;
    title: string;
};
/**
 * MDX Editor that allows live, rich text editing of markdown files on the client.
 * Renders only on Clientside through Next's dynamic import and a forwardRef wrapping so
 * that useRef hook properly is passed down to the function.
 * @param props includes MDX string and title string
 */
export default function EditorInternals({ material, title }: EditorProps) {
    const editorRef = React.useRef<MDXEditorMethods>(null);
    // const utils = apiClientside.useContext();
    // const updateMaterialMutation =
    //     apiClientside.db.updateMdxByModelId.useMutation({
    //         onSuccess: () => {
    //             toast.success("Success! Saved to database.");
    //             utils.db.getMdxByModelId.invalidate();
    //         },
    //         onError: (error) => {
    //             console.error(error);
    //             toast.error("Something went wrong");
    //         },
    //     });

    // if (!initialMaterial)
    //     throw new Error(
    //         "lessonMaterial Data missing / could not be retrieved from server"
    //     );

    // const { data: material } = apiClientside.db.getMdxByModelId.useQuery(
    //     { id: initialMaterial.id },
    //     {
    //         initialData: initialMaterial,
    //         refetchOnMount: false,
    //         refetchOnReconnect: false,
    //     }
    // );

    // if (!material)
    //     throw new Error(
    //         "lessonMaterial Data missing / could not be retrieved from client query"
    //     );

    const handleSave = async () => {
        const markdownValue = editorRef.current?.getMarkdown();
        if (!markdownValue) {
            console.error("No markdown value in handleSave", markdownValue);
            return;
        }
        // todo turn into actions
        updateMaterialMutation.mutate({
            id: material.id,
            content: markdownValue,
        });
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
        <>
            <Heading as="h1">
                Editing {material.mdxCategory.toLowerCase()} of &quot;
                <span className="italic">{title}</span>&nbsp;&quot;
            </Heading>
            <EditorContext.Provider value={updateMaterialMutation.isLoading}>
                <MDXEditor
                    ref={editorRef}
                    markdown={material.mdx}
                    contentEditableClassName="prose max-w-none"
                    plugins={[
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
                            viewMode: "rich-text",
                            diffMarkdown: "boo",
                        }),
                        markdownShortcutPlugin(),
                        toolbarPlugin({
                            toolbarContents: () => (
                                <DefaultToolbar handleSave={handleSave} />
                            ),
                        }),
                    ]}
                />
            </EditorContext.Provider>
            <div className="border-neutral-border border-dashed border-t-[1px] mb-16"></div>
            <button
                className="btn btn-warning"
                onClick={() => console.log(editorRef.current?.getMarkdown())}
            >
                DEBUG:Print markdown to console
            </button>
        </>
    );
}

type DefaultToolbarProps = {
    handleSave: () => void;
};
const DefaultToolbar: React.FC<DefaultToolbarProps> = ({ handleSave }) => {
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

                                <Separator />
                                <InsertFrontmatter />
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
