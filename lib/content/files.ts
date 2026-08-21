import fs from "node:fs";
import path from "node:path";
import type { ContentFile } from "./types";

export const CONTENT_DIR = path.join(process.cwd(), "content");

/** Base path all content routes are served under. */
export const CONTENT_BASE_PATH = "/articles";

const CONTENT_FILE_RE = /^(.+)\.(mdx|md)$/;

let cachedFiles: ContentFile[] | undefined;

function walk(dir: string, segments: string[], out: ContentFile[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Underscore-prefixed *directories* (`_annotations`, `_critiques`)
            // are real routes in this content set — only `_meta.*` files are
            // excluded below.
            walk(full, [...segments, entry.name], out);
            continue;
        }

        const match = CONTENT_FILE_RE.exec(entry.name);
        if (!match) continue;

        const [, name, extension] = match;
        if (name === "_meta") continue;

        out.push({
            slug: name === "index" ? segments : [...segments, name],
            filePath: path
                .relative(CONTENT_DIR, full)
                .split(path.sep)
                .join("/"),
            format: extension === "md" ? "md" : "mdx",
        });
    }
}

/**
 * Every content file in `content/`, with its route slug. Slug rules reproduce
 * Nextra's: the extension is stripped and `index` collapses into its
 * directory.
 */
export function listContentFiles(): ContentFile[] {
    if (!cachedFiles) {
        const files: ContentFile[] = [];
        walk(CONTENT_DIR, [], files);
        files.sort((a, b) => a.filePath.localeCompare(b.filePath));
        cachedFiles = files;
    }
    return cachedFiles;
}

/** Feeds `generateStaticParams` and the sitemap. */
export function getAllSlugs(): string[][] {
    return listContentFiles().map((file) => file.slug);
}

export function resolveFile(slug: string[] = []): ContentFile | undefined {
    const wanted = slug.join("/");
    return listContentFiles().find((file) => file.slug.join("/") === wanted);
}

export function routeForSlug(slug: string[]): string {
    return slug.length
        ? `${CONTENT_BASE_PATH}/${slug.join("/")}`
        : CONTENT_BASE_PATH;
}

export function readContentFile(filePath: string): string {
    return fs.readFileSync(path.join(CONTENT_DIR, filePath), "utf8");
}
