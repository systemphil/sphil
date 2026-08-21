/**
 * Crawls every rendered article for internal links and reports dead ones.
 *
 *   bun run scripts/content/link-check.ts [baseUrl]
 */
import { inventoryUrls } from "./parity-crawl";

const base = process.argv[2] ?? "http://127.0.0.1:3000";
const HREF_RE = /href="(\/[^"#?]*)/g;

const seen = new Map<string, number>();
const sources = new Map<string, Set<string>>();

/**
 * `cacheComponents` forbids `dynamicParams`, so an unknown article route
 * renders the not-found page inside an already-flushed 200 shell. The status
 * code therefore can't be trusted under /articles — check the slug inventory
 * instead. Redirects (3xx) still count as reachable.
 */
const knownArticleRoutes = new Set([...inventoryUrls(), "/articles"]);

const isArticleRoute = (url: string) =>
    url === "/articles" || url.startsWith("/articles/");

async function statusOf(url: string): Promise<number> {
    const cached = seen.get(url);
    if (cached !== undefined) return cached;
    const response = await fetch(base + url, { redirect: "manual" });
    const status =
        response.status === 200 &&
        isArticleRoute(url) &&
        !knownArticleRoutes.has(url)
            ? 404
            : response.status;
    seen.set(url, status);
    return status;
}

const pages = [...inventoryUrls(), "/articles"];
for (const page of pages) {
    const html = await fetch(base + page).then((response) => response.text());
    for (const [, href] of html.matchAll(HREF_RE)) {
        if (href.startsWith("/_next/") || href.startsWith("/_pagefind/"))
            continue;
        if (!sources.has(href)) sources.set(href, new Set());
        sources.get(href)?.add(page);
    }
}

let broken = 0;
for (const [href, from] of [...sources].sort()) {
    const status = await statusOf(href);
    if (status >= 400) {
        broken++;
        console.error(`${status} ${href}  <- ${[...from].join(", ")}`);
    }
}

console.info(
    `\nChecked ${sources.size} distinct internal links across ${pages.length} pages: ${broken} broken`
);
if (broken) process.exit(1);
