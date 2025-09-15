/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */

import { $NextraMetadata } from "nextra";
import { useMDXComponents } from "nextra-theme-docs";
import { generateStaticParamsFor, importPage } from "nextra/pages";

const SITE_ROOT = process.env.NEXT_PUBLIC_SITE_ROOT as string;

export const generateStaticParams = generateStaticParamsFor("mdxPath");

type CustomMarkdownContentMetadata = $NextraMetadata & {
    seoTitle?: string | null;
};
export async function generateMetadata(props: {
    params: Promise<{ mdxPath: string[] }>;
}) {
    const params = await props.params;
    const metadata = (await importPage(params.mdxPath))
        .metadata as CustomMarkdownContentMetadata;

    const enhancedMetadata = {
        ...metadata,
        twitter: {
            ...(metadata?.twitter || {}),
            site: SITE_ROOT,
            title: "",
            description: "",
            images: ogImages,
        },
        openGraph: {
            ...(metadata?.openGraph || {}),
            site: SITE_ROOT,
            type: "website",
            locale: "en_US",
            siteName: "sPhil",
            title: "",
            description: "",
            images: ogImages,
        },
    };

    const title = metadata?.seoTitle || metadata?.title || "sPhil";
    const description =
        metadata?.description || "Where Philosophy Meets Open Collaboration";

    if (title) {
        enhancedMetadata.title = title;
        enhancedMetadata.twitter.title = title;
        enhancedMetadata.openGraph.title = title;
    }

    if (description) {
        enhancedMetadata.description = description;
        enhancedMetadata.twitter.description = description;
        enhancedMetadata.openGraph.description = description;
    }

    return enhancedMetadata;
}

export default async function Page(props: {
    params: Promise<{ mdxPath: string[] }>;
}) {
    const params = await props.params;
    const result = await importPage(params.mdxPath);
    const { default: MDXContent, toc, metadata } = result;

    const Wrapper = useMDXComponents().wrapper;

    return (
        <Wrapper toc={toc} metadata={metadata}>
            <MDXContent {...props} params={params} />
        </Wrapper>
    );
}

const ogImages = [
    {
        url: "/images/og-image-sphil.avif",
        width: 1200,
        height: 630,
        alt: "sPhil",
        type: "image/avif",
    },
    {
        url: "/images/og-image-sphil.webp",
        width: 1200,
        height: 630,
        alt: "sPhil",
        type: "image/webp",
    },
    {
        url: "/images/og-image-sphil.png",
        width: 1200,
        height: 630,
        alt: "sPhil",
        type: "image/png",
    },
];
