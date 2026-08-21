import type { ReactNode } from "react";

/**
 * Per-page layout flags. Mirrors the subset of Nextra's `theme` object that
 * the `content/**\/_meta.*` files actually use.
 */
export type ThemeFlags = {
    breadcrumb?: boolean;
    pagination?: boolean;
    sidebar?: boolean;
    toc?: boolean;
    layout?: string;
    typesetting?: string;
    collapsed?: boolean;
};

export const DEFAULT_THEME: Required<
    Pick<
        ThemeFlags,
        "breadcrumb" | "sidebar" | "toc" | "layout" | "typesetting"
    >
> = {
    breadcrumb: true,
    sidebar: true,
    toc: true,
    layout: "default",
    typesetting: "default",
};

/**
 * Frontmatter of a content file. The bibliographic keys (`authors`,
 * `editors`, `contributors`, `indexTitle`, …) are consumed by the prepyrus
 * CI tool rather than the site, hence the index signature.
 */
export type Frontmatter = {
    title?: string;
    seoTitle?: string;
    description?: string;
    keywords?: string[];
    searchable?: boolean;
    isArticle?: boolean;
    hidden?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: <Passthrough for prepyrus-only keys>
    [key: string]: any;
};

export type TocEntry = {
    depth: number;
    value: string;
    id: string;
};

export type ContentFile = {
    /** Route segments below `/articles`, e.g. `["hegel", "reference"]`. */
    slug: string[];
    /** Path relative to `content/`, e.g. `hegel/reference/index.mdx`. */
    filePath: string;
    format: "md" | "mdx";
};

/**
 * One entry of a `content/**\/_meta.*` module. `type`/`display` are typed
 * loosely because the `_meta` files are plain object literals, so TypeScript
 * widens their string values.
 */
export type MetaEntry = {
    title?: ReactNode;
    /** `"doc"` (default) | `"page"` | `"separator"` */
    type?: string;
    /** `"normal"` (default) | `"hidden"` | `"children"` */
    display?: string;
    href?: string;
    theme?: ThemeFlags;
};

export type MetaModule = Record<string, MetaEntry | string>;

export type TreeNode = {
    /** File or directory base name. */
    name: string;
    /** Absolute site route, e.g. `/articles/hegel/reference`. */
    route: string;
    title: ReactNode;
    type: "doc" | "page" | "separator";
    display: "normal" | "hidden" | "children";
    href?: string;
    theme: ThemeFlags;
    children?: TreeNode[];
    /** True when the route resolves to a content file. */
    hasPage: boolean;
    /** Path relative to `content/`, when `hasPage`. */
    filePath?: string;
};
