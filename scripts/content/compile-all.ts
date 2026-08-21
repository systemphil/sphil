/**
 * Smoke test for the content engine: compiles every file under `content/`
 * and builds the page tree, reporting failures.
 *
 *   bun run scripts/content/compile-all.ts
 */
import { getAllSlugs, readContentFile, resolveFile } from "lib/content/files";
import { compileArticle } from "lib/content/mdx";
import {
    findPath,
    getBreadcrumb,
    getPageTree,
    getSidebarNodes,
    getTheme,
} from "lib/content/tree";
import { routeForSlug } from "lib/content/files";

const slugs = getAllSlugs();
let failures = 0;

console.info(`Building page tree…`);
const tree = getPageTree();
console.info(`  ${tree.length} top-level nodes`);

console.info(`Compiling ${slugs.length} content files…`);
for (const slug of slugs) {
    const route = routeForSlug(slug);
    try {
        const file = resolveFile(slug);
        if (!file) throw new Error("resolveFile returned nothing");
        const article = await compileArticle(
            readContentFile(file.filePath),
            file.format,
            file.filePath
        );
        const path = findPath(route);
        if (path.length === 0) throw new Error("route not found in page tree");
        getTheme(path);
        getSidebarNodes(path);
        getBreadcrumb(path);
        console.info(
            `  ok  ${route}  (${article.toc.length} headings, "${article.frontmatter.title}")`
        );
    } catch (error) {
        failures++;
        console.error(`  FAIL ${route}: ${(error as Error).message}`);
    }
}

if (failures) {
    console.error(`\n${failures} file(s) failed`);
    process.exit(1);
}
console.info(`\nAll ${slugs.length} files compiled and routed.`);
