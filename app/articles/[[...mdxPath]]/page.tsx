/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */

import { DESCRIPTION, OG_IMAGES, SITE_ROOT, TITLE } from "lib/config/consts";
import { $NextraMetadata } from "nextra";
import { useMDXComponents } from "nextra-theme-docs";
import { generateStaticParamsFor, importPage } from "nextra/pages";

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
            images: OG_IMAGES,
        },
        openGraph: {
            ...(metadata?.openGraph || {}),
            site: SITE_ROOT,
            type: "website",
            locale: "en_US",
            siteName: TITLE,
            title: "",
            description: "",
            images: OG_IMAGES,
        },
    };

    const title = metadata?.seoTitle || metadata?.title || TITLE;
    const description = metadata?.description || DESCRIPTION;

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
