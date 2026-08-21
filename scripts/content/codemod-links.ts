/**
 * One-time (idempotent) codemod: rewrites internal content links to their
 * canonical `/articles/...` form and strips `.md`/`.mdx` extensions.
 *
 * Several of the rewritten links 404 today (e.g. `formatting.mdx` pointed at
 * `/contributing/formatting/basic-markdown`, which has never resolved).
 *
 *   bun run scripts/content/codemod-links.ts [--check]
 */
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Top-level content sections; a root-relative link to one is missing `/articles`. */
const SECTIONS = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

const LINK_RE = /(\]\(|href=")(\/[^)"\s]*)/g;
const MARKDOWN_EXTENSION_RE = /\.mdx?(?=[#?]|$)/;

function rewrite(url: string): string {
    let next = url.replace(MARKDOWN_EXTENSION_RE, "");
    if (next === "/articles" || next.startsWith("/articles/")) return next;

    const [firstSegment] = next.split("/").filter(Boolean);
    if (firstSegment && SECTIONS.includes(firstSegment)) {
        next = `/articles${next}`;
    }
    return next;
}

function* contentFiles(dir: string): Generator<string> {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* contentFiles(full);
        else if (/\.mdx?$/.test(entry.name) && entry.name !== "_meta.ts")
            yield full;
    }
}

const check = process.argv.includes("--check");
let changed = 0;

for (const file of contentFiles(CONTENT_DIR)) {
    const source = fs.readFileSync(file, "utf8");
    const updated = source.replace(LINK_RE, (match, prefix, url) => {
        const next = rewrite(url);
        return next === url ? match : `${prefix}${next}`;
    });

    if (updated === source) continue;
    changed++;
    const relative = path.relative(process.cwd(), file);
    if (check) {
        console.error(`${relative}: internal links need rewriting`);
        continue;
    }
    fs.writeFileSync(file, updated);
    console.info(`${relative}: rewrote internal links`);
}

if (check && changed) {
    process.exit(1);
}
console.info(
    check
        ? "All internal content links are canonical"
        : `Updated ${changed} file(s)`
);
