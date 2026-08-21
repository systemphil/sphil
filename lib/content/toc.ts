import GithubSlugger from "github-slugger";
import { visit } from "unist-util-visit";
import type { TocEntry } from "./types";

/** Matches Nextra's `MARKDOWN_URL_EXTENSION_RE`. */
const MARKDOWN_URL_EXTENSION_RE = /\.mdx?(?:(?=[#?])|$)/;

// biome-ignore lint/suspicious/noExplicitAny: <mdast/hast nodes are loosely typed across unified versions>
type Node = any;

const flatten = (node: Node): string =>
    (node.children ?? [])
        .map((child: Node) =>
            "children" in child
                ? flatten(child)
                : "value" in child
                  ? child.value
                  : ""
        )
        .join("");

/**
 * Assigns `github-slugger` ids to every heading below level 1 and collects
 * them into `file.data.toc`. Identical slugging to Nextra's `remarkHeadings`,
 * so existing `#fragment` deep links keep resolving. Must run before
 * remark-smartypants so that ids are derived from the raw heading text.
 */
export function remarkHeadings() {
    return (tree: Node, file: Node) => {
        const slugger = new GithubSlugger();
        const toc: TocEntry[] = [];

        visit(tree, "heading", (node: Node) => {
            if (node.depth === 1) return;
            node.data ??= {};
            node.data.hProperties ??= {};
            const properties = node.data.hProperties;
            const value = flatten(node);
            const id = slugger.slug(properties.id || value);
            properties.id = id;
            toc.push({ depth: node.depth, value, id });
        });

        file.data.toc = toc;
    };
}

/**
 * Nextra derives a missing frontmatter `title` from the first level-1
 * heading. Several content files rely on this (e.g. `formatting.mdx`
 * renders as "Markdown").
 */
export function remarkTitle() {
    return (tree: Node, file: Node) => {
        visit(tree, "heading", (node: Node) => {
            if (node.depth !== 1 || file.data.title) return;
            file.data.title = flatten(node);
        });
    };
}

/**
 * Strips `.md`/`.mdx` from internal link targets, as Nextra's
 * `remarkLinkRewrite` does. The content codemod normalises links at rest;
 * this keeps stragglers working.
 */
export function remarkStripMarkdownExtensions() {
    return (tree: Node) => {
        visit(tree, "link", (node: Node) => {
            if (typeof node.url !== "string") return;
            if (/^[a-z][a-z\d+\-.]*:/i.test(node.url)) return;
            node.url = node.url.replace(MARKDOWN_URL_EXTENSION_RE, "");
        });
    };
}

const TITLE_MINOR_WORDS = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "from",
    "in",
    "nor",
    "of",
    "on",
    "or",
    "per",
    "so",
    "the",
    "to",
    "via",
    "vs",
    "with",
    "yet",
]);

/**
 * Last-resort page title, derived from the file name — Nextra's
 * `pageTitleFromFilename`.
 */
export function titleFromFilename(name: string): string {
    const words = name.replace(/[-_]/g, " ").split(/\s+/).filter(Boolean);
    return words
        .map((word, index) => {
            const lower = word.toLowerCase();
            if (
                index > 0 &&
                index < words.length - 1 &&
                TITLE_MINOR_WORDS.has(lower)
            ) {
                return lower;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}
