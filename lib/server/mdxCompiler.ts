// @ts-nocheck
// TODO fix types for node remark-directive below

import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import rehypeExternalLinks from "rehype-external-links";

/**
 * Compiles MDX strings into JavaScript. Configure additional plugins here.
 * @docs {@link https://mdxjs.com/packages/mdx/#compilefile-options | MDX compiler options}
 */
export const mdxCompiler = async (mdxSource: string) => {
    try {
        const mdxCompiled = String(
            await compile(mdxSource, {
                outputFormat: "function-body",
                development: false,
                // ^-- Generate code for production.
                // `false` if you use `/jsx-runtime` on client, `true` if you use
                // `/jsx-dev-runtime`.
                remarkPlugins: [remarkGfm, remarkDirective, adminitionPlugin],
                rehypePlugins: [
                    [
                        rehypeExternalLinks,
                        { target: "_blank", rel: ["noopener", "noreferrer"] },
                    ],
                ],
            })
        );
        return mdxCompiled;
    } catch (e) {
        throw new Error("An error occured in the mdxCompiler");
    }
};
export type MDXCompilerReturnType = Awaited<ReturnType<typeof mdxCompiler>>;
const ADMONITION_TYPES = ["note", "tip", "danger", "info", "caution"];

/**
 * Plugin for the MDX compiler that adds admonition/callout nodes and classes to compiled output.
 * Traverses the tree
 * to check for `directives` (Markdown items tagged with `:::`) with special names.
 * E.g. `:::danger <content-here> :::`.
 *
 * @warning When updating the MDX package, CSS classes may get out of sync. Veryify this with the styles found in
 * the editor vs what are defined here and the MDXRenderer component.
 *
 * @todo some type-checking is switched off owing to possible issues in the library or cross-library dependency.
 * The unifiedjs/mdx-packages ecosystem are currently transitioning into new versions with stricter typing, so types should be updated
 * here when the new versions are out. See: https://github.com/orgs/mdx-js/discussions/2355#discussioncomment-7139230
 */
function adminitionPlugin() {
    return (tree: Root) => {
        visit(tree, (node) => {
            if (
                node.type === "containerDirective" ||
                node.type === "leafDirective" ||
                node.type === "textDirective"
            ) {
                if (ADMONITION_TYPES.includes(node.name)) {
                    const tagName =
                        node.type === "textDirective" ? "span" : "div";

                    if (node.name === ADMONITION_TYPES[0]) {
                        node.attributes = {
                            ...node.attributes,
                            className: "_admonitionNote_1tncs_153",
                        };
                    } else if (node.name === ADMONITION_TYPES[1]) {
                        node.attributes = {
                            ...node.attributes,
                            className: "_admonitionTip_1tncs_154",
                        };
                    } else if (node.name === ADMONITION_TYPES[2]) {
                        node.attributes = {
                            ...node.attributes,
                            className: "_admonitionDanger_1tncs_151",
                        };
                    } else if (node.name === ADMONITION_TYPES[3]) {
                        node.attributes = {
                            ...node.attributes,
                            className: "_admonitionInfo_1tncs_152",
                        };
                    } else if (node.name === ADMONITION_TYPES[4]) {
                        node.attributes = {
                            ...node.attributes,
                            className: "_admonitionCaution_1tncs_155",
                        };
                    }

                    // @ts-ignore
                    node.type = "paragraph";
                    node.data = {
                        ...node.data,
                        hName: tagName,
                        hProperties: node.attributes,
                    };

                    node.children = [
                        {
                            type: "paragraph",
                            data: {
                                hName: "div",
                                hProperties: {
                                    className: ["_nestedEditor_uazmk_963"],
                                },
                            },
                            // @ts-ignore
                            children: node.children,
                        },
                    ];
                }
            }
        });
    };
}
