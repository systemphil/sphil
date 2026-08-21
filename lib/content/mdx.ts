import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import path from "node:path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import { visit } from "unist-util-visit";
import { CONTENT_DIR } from "./files";
import {
    remarkHeadings,
    remarkStripMarkdownExtensions,
    remarkTitle,
    titleFromFilename,
} from "./toc";
import type { Frontmatter, TocEntry } from "./types";

// biome-ignore lint/suspicious/noExplicitAny: <mdast/hast nodes are loosely typed across unified versions>
type Node = any;

/**
 * Matches Nextra's `DEFAULT_REHYPE_PRETTY_CODE_OPTIONS` so highlighting is
 * byte-for-byte comparable with the old pipeline.
 */
const PRETTY_CODE_OPTIONS = {
    keepBackground: false,
    grid: false,
    defaultLang: { block: "plaintext" },
    theme: { light: "github-light", dark: "github-dark" },
    onVisitLine(node: Node) {
        if (node.children.length === 0) {
            node.children.push({ type: "text", value: " " });
        }
        delete node.properties["data-line"];
    },
};

/**
 * Turns ```` ```mermaid ```` fences into `<Mermaid chart="…" />`, the same
 * transform `@theguild/remark-mermaid` performed inside Nextra. Only valid
 * for MDX documents; the two `.md` files contain no diagrams.
 */
function remarkMermaid() {
    return (tree: Node) => {
        const found: [Node, number, Node][] = [];
        visit(
            tree,
            { type: "code", lang: "mermaid" },
            (node, index, parent) => {
                if (typeof index === "number" && parent) {
                    found.push([node, index, parent]);
                }
            }
        );
        for (const [node, index, parent] of found) {
            parent.children.splice(index, 1, {
                type: "mdxJsxFlowElement",
                name: "Mermaid",
                attributes: [
                    {
                        type: "mdxJsxAttribute",
                        name: "chart",
                        value: node.value.replaceAll("\n", "\\n"),
                    },
                ],
                children: [],
            });
        }
    };
}

/**
 * Flattens `rehype-pretty-code`'s `<figure>` wrapper back to a bare `<pre>`
 * and attaches the copy-code marker, reproducing Nextra's
 * `rehypeParseCodeMeta` + `rehypeAttachCodeMeta` pair with
 * `defaultShowCopyCode: true`.
 */
function rehypeCodeMeta() {
    return (tree: Node) => {
        visit(tree, { tagName: "figure" }, (node: Node) => {
            if (!("data-rehype-pretty-code-figure" in node.properties)) return;
            const [pre] = node.children.filter(
                (child: Node) => child.tagName === "pre"
            );
            if (!pre) return;

            const title = node.children.find(
                (child: Node) =>
                    child.tagName === "figcaption" &&
                    "data-rehype-pretty-code-title" in (child.properties ?? {})
            );

            Object.assign(node, pre);
            delete node.properties["data-theme"];
            node.properties["data-copy"] = "";
            if (title) {
                node.properties["data-filename"] = title.children?.[0]?.value;
            }

            const [code] = node.children;
            if (code?.properties) {
                delete code.properties["data-theme"];
                delete code.properties["data-language"];
            }
        });
    };
}

/**
 * Compiles one content file to MDX function-body source, plus its table of
 * contents and frontmatter.
 */
export async function compileArticle(
    source: string,
    format: "md" | "mdx",
    filePath: string
) {
    const { data, content: body } = matter(source);

    const compiled = await compile(
        { value: body, path: path.join(CONTENT_DIR, filePath) },
        {
            format,
            outputFormat: "function-body",
            development: false,
            remarkPlugins: [
                remarkTitle,
                ...(format === "mdx" ? [remarkMermaid] : []),
                remarkGfm,
                remarkHeadings,
                remarkStripMarkdownExtensions,
                remarkSmartypants,
            ],
            rehypePlugins: [
                // `.md` files contain raw HTML (`<mark>`, `<sub>`, styled
                // spans) that the MDX compiler otherwise drops. Same plugin
                // and passthrough set Nextra applied for md format.
                ...(format === "md"
                    ? [
                          [
                              rehypeRaw,
                              {
                                  passThrough: [
                                      "mdxjsEsm",
                                      "mdxJsxFlowElement",
                                      "mdxTextExpression",
                                  ],
                              },
                          ] as [typeof rehypeRaw, { passThrough: string[] }],
                      ]
                    : []),
                [rehypePrettyCode, PRETTY_CODE_OPTIONS],
                rehypeCodeMeta,
            ],
        }
    );

    const vfileData = compiled.data as { toc?: TocEntry[]; title?: string };
    const frontmatter: Frontmatter = { ...data };

    if (!frontmatter.title) {
        frontmatter.title =
            vfileData.title ?? titleFromFilename(path.parse(filePath).name);
    }

    return {
        code: String(compiled),
        toc: vfileData.toc ?? [],
        frontmatter,
    };
}
