import path from "node:path";
import matter from "gray-matter";
import { readContentFile } from "./files";
import { titleFromFilename } from "./toc";
import type { Frontmatter } from "./types";

const FENCE_RE = /^(?:```|~~~)[\s\S]*?^(?:```|~~~)\s*$/gm;
const H1_RE = /^\s{0,3}#\s+(.+?)\s*$/m;

const cachedFrontmatter = new Map<string, Frontmatter>();

/**
 * Frontmatter of a content file, with Nextra's title fallback chain applied:
 * `title` → first level-1 heading → title-cased filename.
 */
export function readFrontmatter(filePath: string): Frontmatter {
    const cached = cachedFrontmatter.get(filePath);
    if (cached) return cached;

    const { data, content } = matter(readContentFile(filePath));
    const frontmatter: Frontmatter = { ...data };

    if (!frontmatter.title) {
        const heading = H1_RE.exec(content.replace(FENCE_RE, ""))?.[1];
        frontmatter.title =
            heading ?? titleFromFilename(path.parse(filePath).name);
    }

    cachedFrontmatter.set(filePath, frontmatter);
    return frontmatter;
}
