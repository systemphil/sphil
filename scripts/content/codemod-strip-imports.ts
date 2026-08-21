/**
 * One-time (idempotent) codemod: removes ESM `import` statements from
 * `content/**\/*.mdx`.
 *
 * The runtime MDX compiler cannot resolve bare specifiers, and every
 * component these files imported is supplied through the component map in
 * `lib/components/mdx/components.tsx`.
 *
 *   bun run scripts/content/codemod-strip-imports.ts [--check]
 */
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const IMPORT_RE = /^import\s[^\n]*?from\s+["'][^"']+["'];?\s*$/;
const FENCE_RE = /^\s*(?:```|~~~)/;

function* mdxFiles(dir: string): Generator<string> {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* mdxFiles(full);
        else if (entry.name.endsWith(".mdx")) yield full;
    }
}

const check = process.argv.includes("--check");
let changed = 0;

for (const file of mdxFiles(CONTENT_DIR)) {
    const source = fs.readFileSync(file, "utf8");
    const lines = source.split("\n");
    const output: string[] = [];
    let inFence = false;
    let removed = 0;

    for (const line of lines) {
        if (FENCE_RE.test(line)) inFence = !inFence;

        if (!inFence && IMPORT_RE.test(line)) {
            removed++;
            // Drop a blank line that only separated this import from the next
            // block, so we don't leave a double gap behind.
            if (output.at(-1) === "") output.pop();
            continue;
        }
        output.push(line);
    }

    if (!removed) continue;
    changed++;
    const relative = path.relative(process.cwd(), file);
    if (check) {
        console.error(`${relative}: ${removed} import statement(s) remaining`);
        continue;
    }
    fs.writeFileSync(file, output.join("\n"));
    console.info(`${relative}: removed ${removed} import statement(s)`);
}

if (check && changed) {
    process.exit(1);
}
console.info(
    check ? "No imports left in content/**/*.mdx" : `Updated ${changed} file(s)`
);
