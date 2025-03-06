"use client";

import { run } from "@mdx-js/mdx";
import { Fragment, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import { type MDXModule } from "mdx/types";
import { MDXCompilerReturnType } from "lib/server/mdxCompiler";
import { Loading } from "./animations/Loading";
import { EmbedTeacherProfile } from "features/editor/components/EmbedTeacherProfile";
import { EmbedYT } from "./ui/EmbedYT";

/* cSpell:disable */

/**
 * Renders MDX content to the UI. Requires compiled MDX string. TailwindCSS formatting applied through prose using tailwindcss/typography.
 * To configure MDX plugins, please see the compiler.
 * @docs {@link https://mdxjs.com/guides/mdx-on-demand/ | MDX on-demand}
 */
export const MDXRenderer = ({ data }: { data: MDXCompilerReturnType }) => {
    const [mdxModule, setMdxModule] = useState<MDXModule | undefined>(
        undefined
    );
    const Content = mdxModule ? mdxModule.default : Fragment;

    /**
     * The `;` at the start of the code in the useEffect below is used to ensure correct interpretation by the JS parser.
     * The `(() => {})()` is an immediately invoked function expression (IIFE). Creates a self-contained scope for variables and
     * execution without polluting the surrounding scope.
     * @docs {@link https://developer.mozilla.org/en-US/articles/Glossary/IIFE | About IIFE }
     */
    useEffect(() => {
        (async () => {
            setMdxModule(await run(data, { ...runtime, Fragment }));
        })();
    }, [data]);

    return (
        <>
            {mdxModule ? (
                <article className="mdxeditor _editorRoot_uazmk_53 _editorWrapper_uazmk_154">
                    <div className="mdxeditor-rich-text-editor block">
                        <div className="_rootContentEditableWrapper_uazmk_1097 mdxeditor-root-contenteditable">
                            <div className="_contentEditable_uazmk_379 !prose dark:!prose-invert w-full">
                                <Content
                                    components={{
                                        EmbedTeacherProfile(props) {
                                            return (
                                                <EmbedTeacherProfile
                                                    {...props}
                                                />
                                            );
                                        },
                                        EmbedYT(props) {
                                            return <EmbedYT {...props} />;
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </article>
            ) : (
                <Loading.RingLg />
            )}
        </>
    );
};
