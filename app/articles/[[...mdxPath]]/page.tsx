import { notFound } from "next/navigation";
import { ArticleShell } from "lib/components/docs/ArticleShell";
import { DESCRIPTION, OG_IMAGES, TITLE } from "lib/config/consts";
import { KEYWORDS } from "lib/config/keywords";
import { loadArticle } from "lib/content/compile";
import { getAllSlugs, routeForSlug } from "lib/content/files";
import {
    findPath,
    getBreadcrumb,
    getSidebarNodes,
    getTheme,
} from "lib/content/tree";
import type { Metadata } from "next";

/**
 * Every content slug is prerendered. `dynamicParams` cannot be set alongside
 * `cacheComponents`, so unknown paths fall through to `notFound()` below.
 */
export function generateStaticParams() {
    return getAllSlugs().map((mdxPath) => ({ mdxPath }));
}

function mergeKeywords(article?: string[] | null): string[] {
    const incoming = (article ?? []).concat(KEYWORDS ?? []);
    const result: string[] = [];
    const seen = new Set<string>();
    for (const k of incoming) {
        const s = (k ?? "").trim();
        if (!s) continue;
        const key = s.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            result.push(s);
        }
    }
    return result;
}

export async function generateMetadata(props: {
    params: Promise<{ mdxPath?: string[] }>;
}): Promise<Metadata> {
    const params = await props.params;
    const article = await loadArticle(params.mdxPath ?? []);
    if (!article) {
        // Unknown slug: the page below calls `notFound()`.
        return { title: "Page Not Found" };
    }
    const articleMetadata = article.frontmatter;

    const enhancedMetadata: Metadata = {
        ...articleMetadata,
        twitter: {
            ...(articleMetadata.twitter || {}),
            title: "",
            description: "",
            images: OG_IMAGES,
        },
        openGraph: {
            ...(articleMetadata.openGraph || {}),
            title: "",
            description: "",
            images: OG_IMAGES,
        },
    };

    const title = articleMetadata.seoTitle || articleMetadata.title || TITLE;
    const description = articleMetadata.description || DESCRIPTION;

    if (title) {
        enhancedMetadata.title = title;
        if (enhancedMetadata.twitter) {
            enhancedMetadata.twitter.title = title;
        }
        if (enhancedMetadata.openGraph) {
            enhancedMetadata.openGraph.title = title;
        }
    }

    if (description) {
        enhancedMetadata.description = description as string;
        if (enhancedMetadata.twitter) {
            enhancedMetadata.twitter.description = description as string;
        }
        if (enhancedMetadata.openGraph) {
            enhancedMetadata.openGraph.description = description as string;
        }
    }

    if (
        articleMetadata.keywords &&
        Array.isArray(articleMetadata.keywords) &&
        articleMetadata.keywords.length > 0
    ) {
        enhancedMetadata.keywords = mergeKeywords(articleMetadata.keywords);
    }

    return enhancedMetadata;
}

export default async function Page(props: {
    params: Promise<{ mdxPath?: string[] }>;
}) {
    const { mdxPath = [] } = await props.params;
    const article = await loadArticle(mdxPath);

    if (!article) {
        notFound();
    }

    const activePath = findPath(routeForSlug(mdxPath));

    return (
        <ArticleShell
            article={article}
            theme={getTheme(activePath)}
            sidebarNodes={getSidebarNodes(activePath)}
            breadcrumb={getBreadcrumb(activePath)}
        />
    );
}
