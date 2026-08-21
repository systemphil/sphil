/**
 * Parity crawler for the Nextra -> in-house MDX pipeline migration.
 *
 * Usage:
 *   bun run scripts/content/parity-crawl.ts snapshot <out.json> [baseUrl]
 *   bun run scripts/content/parity-crawl.ts compare  <old.json> [baseUrl]
 *
 * Snapshots, for every content URL, the HTTP status, <title>, the first <h1>
 * and the ordered list of h2/h3 ids, so that heading anchors and page titles
 * can be asserted identical before/after the migration.
 */
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function inventoryUrls(): string[] {
    const urls: string[] = [];
    const walk = (dir: string, segments: string[]) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full, [...segments, entry.name]);
                continue;
            }
            const match = /^(.+)\.(mdx?|md)$/.exec(entry.name);
            if (!match) continue;
            const name = match[1];
            if (name === "_meta") continue;
            const parts = name === "index" ? segments : [...segments, name];
            urls.push(`/articles${parts.length ? `/${parts.join("/")}` : ""}`);
        }
    };
    walk(CONTENT_DIR, []);
    return urls.sort();
}

type PageSnapshot = {
    status: number;
    title: string | null;
    h1: string | null;
    headingIds: string[];
    redirectedTo?: string;
};

const decode = (raw: string) =>
    raw
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;|&#39;/g, "'")
        .replace(/&#x26;/g, "&")
        .replace(/\s+/g, " ")
        .trim();

async function snapshotUrl(base: string, url: string): Promise<PageSnapshot> {
    const res = await fetch(base + url, { redirect: "manual" });
    if (res.status >= 300 && res.status < 400) {
        return {
            status: res.status,
            title: null,
            h1: null,
            headingIds: [],
            redirectedTo: res.headers.get("location") ?? undefined,
        };
    }
    const html = await res.text();
    const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? null;
    const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ?? null;
    const headingIds: string[] = [];
    for (const m of html.matchAll(/<h([2-3])\b([^>]*)>/gi)) {
        const id = /\bid="([^"]+)"/.exec(m[2])?.[1];
        if (id) headingIds.push(`h${m[1]}#${id}`);
    }
    return {
        status: res.status,
        title: title ? decode(title) : null,
        h1: h1 ? decode(h1) : null,
        headingIds,
    };
}

const APP_URLS = ["/", "/courses", "/newsletter", "/about-us", "/team"];

async function snapshot(base: string, extraUrls: string[] = []) {
    const urls = [
        ...new Set([
            ...inventoryUrls(),
            "/articles",
            ...APP_URLS,
            ...extraUrls,
        ]),
    ].sort();
    const out: Record<string, PageSnapshot> = {};
    for (const url of urls) {
        try {
            out[url] = await snapshotUrl(base, url);
        } catch (error) {
            out[url] = {
                status: -1,
                title: `ERROR ${(error as Error).message}`,
                h1: null,
                headingIds: [],
            };
        }
        process.stdout.write(`${out[url].status} ${url}\n`);
    }
    return out;
}

function diff(
    before: Record<string, PageSnapshot>,
    after: Record<string, PageSnapshot>
) {
    const problems: string[] = [];
    for (const [url, a] of Object.entries(after)) {
        const b = before[url];
        if (!b) continue;
        if (a.status !== b.status) {
            problems.push(`${url}: status ${b.status} -> ${a.status}`);
        }
        if (a.status !== 200) continue;
        if (a.title !== b.title) {
            problems.push(
                `${url}: title ${JSON.stringify(b.title)} -> ${JSON.stringify(a.title)}`
            );
        }
        if (a.h1 !== b.h1) {
            problems.push(
                `${url}: h1 ${JSON.stringify(b.h1)} -> ${JSON.stringify(a.h1)}`
            );
        }
        const bIds = b.headingIds.join(",");
        const aIds = a.headingIds.join(",");
        if (bIds !== aIds) {
            const missing = b.headingIds.filter(
                (id) => !a.headingIds.includes(id)
            );
            const added = a.headingIds.filter(
                (id) => !b.headingIds.includes(id)
            );
            problems.push(
                `${url}: heading ids differ; missing=[${missing.join(" ")}] added=[${added.join(" ")}]`
            );
        }
    }
    return problems;
}

if (import.meta.main) {
    const [mode, file, baseArg] = process.argv.slice(2);
    const base = baseArg ?? "http://127.0.0.1:3000";

    if (mode === "snapshot") {
        const data = await snapshot(base);
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        console.info(`\nWrote ${Object.keys(data).length} entries to ${file}`);
    } else if (mode === "compare") {
        const before = JSON.parse(fs.readFileSync(file, "utf8"));
        // Crawl the baseline's URLs too, so that a page which has since been
        // renamed or deleted shows up rather than silently dropping out.
        const after = await snapshot(base, Object.keys(before));
        const problems = diff(before, after);
        if (problems.length === 0) {
            console.info("\n✅ parity OK");
        } else {
            console.error(`\n❌ ${problems.length} parity problems:`);
            for (const p of problems) console.error(`  - ${p}`);
            process.exit(1);
        }
    } else {
        console.error(
            "usage: parity-crawl.ts <snapshot|compare> <file> [baseUrl]"
        );
        process.exit(1);
    }
}
