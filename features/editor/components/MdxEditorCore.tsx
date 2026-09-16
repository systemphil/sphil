"use client";

/* cSpell:disable */

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
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
    type MDXEditorProps,
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
import { Loading } from "lib/components/animations/Loading";
import { actionUploadImage } from "lib/server/actions";
import { cn, sleep } from "lib/utils";
import { ButtonInsertYouTube } from "./ButtonInsertYouTube";
import { ButtonInsertTeacherProfile } from "./ButtonInsertTeacherProfile";

/**
 * Context to hold the state of mutation loading as passing props did not work with the MDXEditor Toolbar.
 */
const EditorContext = createContext(false);

export type MdxEditorCoreProps = {
    /** Initial markdown; also the baseline for the diff view. */
    markdown: string;
    /**
     * Persists the editor's current markdown. Toasts and errors are the
     * caller's to handle; the save button shows a spinner while it runs.
     */
    onSave: (markdown: string) => Promise<void>;
    className?: string;
    /** Focus the editor once it is on the page; off unless set. */
    autoFocus?: MDXEditorProps["autoFocus"];
};

/**
 * The MDX editor with sPhil's plugins and toolbar, independent of where the
 * markdown is stored. Must render client-side only (see Editor.tsx for the
 * dynamic-import wrapper pattern).
 */
export default function MdxEditorCore({
    markdown,
    onSave,
    className,
    autoFocus,
}: MdxEditorCoreProps) {
    const editorRef = React.useRef<MDXEditorMethods>(null);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    /**
     * MDXEditor's own `autoFocus` fires on a timeout right after creating its
     * Lexical editor, which can be before the contenteditable is attached, and
     * Lexical's focus() silently no-ops without a root element. So wait for the
     * element (a few frames at most), then focus through the editor's methods.
     */
    // biome-ignore lint/correctness/useExhaustiveDependencies: focus once on mount only
    useEffect(() => {
        if (!autoFocus) return;

        const opts = autoFocus === true ? undefined : autoFocus;
        let frame = 0;
        let attempts = 0;

        const tryFocus = () => {
            const editable = containerRef.current?.querySelector(
                '[contenteditable="true"]'
            );

            if (editable && editorRef.current) {
                editorRef.current.focus(undefined, opts);
                return;
            }

            if (attempts++ < 120) {
                frame = requestAnimationFrame(tryFocus);
            }
        };

        frame = requestAnimationFrame(tryFocus);

        return () => cancelAnimationFrame(frame);
    }, []);

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
        if (markdownValue === undefined) {
            console.error("Editor not ready in handleSave");
            toast.error("Editor not ready. See console (F12) for details");
            return;
        }
        setIsLoading(true);
        try {
            await onSave(markdownValue);
        } finally {
            setIsLoading(false);
        }
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
        <div ref={containerRef} className="contents">
            <EditorContext.Provider value={isLoading}>
                <MDXEditor
                    className={cn(
                        "border-2 border-gray-200 rounded-lg full-demo-mdxeditor min-h-screen",
                        className
                    )}
                    ref={editorRef}
                    markdown={markdown}
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
                                markdown || "No differences to show. Ignore this.",
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
