/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */

import { DESCRIPTION, OG_IMAGES, TITLE } from "lib/config/consts";
import { KEYWORDS } from "lib/config/keywords";
import type { $NextraMetadata } from "nextra";
import { useMDXComponents } from "nextra-theme-docs";
import { generateStaticParamsFor, importPage } from "nextra/pages";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

type CustomMarkdownContentMetadata = $NextraMetadata & {
    seoTitle?: string | null | undefined;
    keywords?: string[] | null | undefined;
    description?: string | null | undefined;
};

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
    params: Promise<{ mdxPath: string[] }>;
}) {
    const params = await props.params;
    const articleMetadata = (await importPage(params.mdxPath))
        .metadata as CustomMarkdownContentMetadata;

    const enhancedMetadata: $NextraMetadata = {
        ...articleMetadata,
        twitter: {
            ...(articleMetadata?.twitter || {}),
            title: "",
            description: "",
            images: OG_IMAGES,
        },
        openGraph: {
            ...(articleMetadata?.openGraph || {}),
            title: "",
            description: "",
            images: OG_IMAGES,
        },
    };

    const title = articleMetadata?.seoTitle || articleMetadata?.title || TITLE;
    const description = articleMetadata?.description || DESCRIPTION;

    if (title) {
        enhancedMetadata.title = title;
        enhancedMetadata.twitter!.title = title;
        enhancedMetadata.openGraph!.title = title;
    }

    if (description) {
        enhancedMetadata.description = description as string;
        enhancedMetadata.twitter!.description = description as string;
        enhancedMetadata.openGraph!.description = description as string;
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
    params: Promise<{ mdxPath: string[] }>;
}) {
    const params = await props.params;
    const {
        default: MDXContent,
        toc,
        metadata,
        sourceCode,
    } = await importPage(params.mdxPath);
    const Wrapper = useMDXComponents().wrapper;

    return (
        <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
            <MDXContent {...props} params={params} />
        </Wrapper>
    );
}
