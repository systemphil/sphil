import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { CONTENT_BASE_PATH, CONTENT_DIR } from "./files";
import { readFrontmatter } from "./frontmatter";
import { metaModules } from "./meta.generated";
import { titleFromFilename } from "./toc";
import {
    DEFAULT_THEME,
    type MetaEntry,
    type MetaModule,
    type ThemeFlags,
    type TreeNode,
} from "./types";

const CONTENT_FILE_RE = /^(.+)\.(mdx|md)$/;

type DirectoryEntries = {
    /** Content files in this directory, by base name (no `index`). */
    files: Map<string, string>;
    /** Sub-directory names. */
    dirs: Set<string>;
    /** This directory's own page, if any. */
    indexFile?: string;
};

function readDirectory(
    dirRelative: string,
    ownPageFile?: string
): DirectoryEntries {
    const absolute = path.join(CONTENT_DIR, dirRelative);
    const files = new Map<string, string>();
    const dirs = new Set<string>();
    let indexFile = ownPageFile;

    for (const entry of fs
        .readdirSync(absolute, { withFileTypes: true })
        .sort((a, b) => a.name.localeCompare(b.name))) {
        if (entry.isDirectory()) {
            dirs.add(entry.name);
            continue;
        }
        const match = CONTENT_FILE_RE.exec(entry.name);
        if (!match || match[1] === "_meta") continue;

        const relative = dirRelative
            ? `${dirRelative}/${entry.name}`
            : entry.name;
        if (match[1] === "index") {
            indexFile = relative;
        } else {
            files.set(match[1], relative);
        }
    }

    return { files, dirs, indexFile };
}

function normalizeEntry(entry: MetaEntry | string | undefined): MetaEntry {
    if (entry === undefined) return {};
    if (typeof entry === "string") return entry ? { title: entry } : {};
    return entry;
}

function mergeEntry(wildcard: MetaEntry, entry: MetaEntry): MetaEntry {
    return {
        ...wildcard,
        ...entry,
        theme: { ...wildcard.theme, ...entry.theme },
    };
}

function routeFor(segments: string[]): string {
    return segments.length
        ? `${CONTENT_BASE_PATH}/${segments.join("/")}`
        : CONTENT_BASE_PATH;
}

function buildChildren(
    dirRelative: string,
    segments: string[],
    ownPageFile: string | undefined
): TreeNode[] {
    const { files, dirs, indexFile } = readDirectory(dirRelative, ownPageFile);
    const meta: MetaModule = metaModules[dirRelative] ?? {};
    const wildcard = normalizeEntry(meta["*"]);

    // `foo.mdx` next to a `foo/` directory belongs to the directory, as the
    // directory's own page — not as a sibling entry.
    const availableNames = new Set<string>([
        ...(indexFile ? ["index"] : []),
        ...[...files.keys()].filter((name) => !dirs.has(name)),
        ...dirs,
    ]);

    const metaOrder = Object.keys(meta).filter((key) => key !== "*");
    const rest = [...availableNames]
        .filter((name) => !metaOrder.includes(name))
        .sort((a, b) =>
            a === "index" ? -1 : b === "index" ? 1 : a.localeCompare(b)
        );

    const nodes: TreeNode[] = [];

    for (const name of [...metaOrder, ...rest]) {
        const entry = mergeEntry(wildcard, normalizeEntry(meta[name]));

        if (entry.type === "separator") {
            nodes.push({
                name,
                route: "",
                title: entry.title ?? "",
                type: "separator",
                display: "normal",
                theme: entry.theme ?? {},
                hasPage: false,
            });
            continue;
        }

        if (!availableNames.has(name)) {
            // `_meta`-only entry, e.g. an external link.
            if (!entry.href) continue;
            nodes.push({
                name,
                route: entry.href,
                title: entry.title ?? titleFromFilename(name),
                type: (entry.type as TreeNode["type"]) ?? "doc",
                display: (entry.display as TreeNode["display"]) ?? "normal",
                href: entry.href,
                theme: entry.theme ?? {},
                hasPage: false,
            });
            continue;
        }

        if (name === "index") {
            const filePath = indexFile as string;
            nodes.push({
                name,
                route: routeFor(segments),
                title: entry.title || readFrontmatter(filePath).title,
                type: (entry.type as TreeNode["type"]) ?? "doc",
                display: (entry.display as TreeNode["display"]) ?? "normal",
                theme: entry.theme ?? {},
                hasPage: true,
                filePath,
            });
            continue;
        }

        const childSegments = [...segments, name];

        if (dirs.has(name)) {
            const childDir = dirRelative ? `${dirRelative}/${name}` : name;
            const children = buildChildren(
                childDir,
                childSegments,
                files.get(name)
            );
            nodes.push({
                name,
                route: routeFor(childSegments),
                title: entry.title || titleFromFilename(name),
                type: (entry.type as TreeNode["type"]) ?? "doc",
                display: (entry.display as TreeNode["display"]) ?? "normal",
                theme: entry.theme ?? {},
                hasPage: false,
                children,
            });
            continue;
        }

        const filePath = files.get(name) as string;
        nodes.push({
            name,
            route: routeFor(childSegments),
            title: entry.title || readFrontmatter(filePath).title,
            type: (entry.type as TreeNode["type"]) ?? "doc",
            display: (entry.display as TreeNode["display"]) ?? "normal",
            theme: entry.theme ?? {},
            hasPage: true,
            filePath,
        });
    }

    return nodes;
}

/** The full content page tree, rooted at `/articles`. */
export const getPageTree = cache((): TreeNode[] =>
    buildChildren("", [], undefined)
);

/**
 * Chain of nodes from the tree root down to `route`, longest match wins so
 * that a folder's own index page is the last element.
 */
export function findPath(route: string): TreeNode[] {
    let best: TreeNode[] = [];

    const walk = (nodes: TreeNode[], trail: TreeNode[]) => {
        for (const node of nodes) {
            if (node.type === "separator") continue;
            const isOnPath =
                node.route === route || route.startsWith(`${node.route}/`);
            if (!isOnPath) continue;

            const next = [...trail, node];
            if (node.route === route && next.length > best.length) {
                best = next;
            }
            if (node.children) walk(node.children, next);
        }
    };

    walk(getPageTree(), []);
    return best;
}

/** Layout flags for `route`, merged root-first along the active path. */
export function getTheme(activePath: TreeNode[]): Required<ThemeFlags> {
    const theme: ThemeFlags = { ...DEFAULT_THEME };
    for (const node of activePath) {
        Object.assign(theme, node.theme);
    }
    return theme as Required<ThemeFlags>;
}

/**
 * Sidebar contents for `route`: the children of the deepest ancestor marked
 * `type: "page"` — the same grouping Nextra derived from its page map.
 */
export function getSidebarNodes(activePath: TreeNode[]): TreeNode[] {
    for (let index = activePath.length - 1; index >= 0; index--) {
        const node = activePath[index];
        if (node.type !== "page") continue;
        return node.children ?? [];
    }
    return activePath[0]?.children ?? [];
}

/**
 * Breadcrumb trail. `display: "children"` sections are transparent, matching
 * Nextra's `activePath` flattening.
 */
export function getBreadcrumb(activePath: TreeNode[]): TreeNode[] {
    return activePath.filter(
        (node) => node.display !== "children" && node.type !== "separator"
    );
}
