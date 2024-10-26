import NavbarHeader from "@/components/NavbarHeader";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import { type DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { ArticleWrapper } from "@/components/ArticleWrapper";
import { TableOfContentsExtra } from "@/components/TableOfContentsExtra";

const SITE_ROOT = process.env.NEXT_PUBLIC_SITE_ROOT;

const config: DocsThemeConfig = {
    head: function Head() {
        const router = useRouter();
        const { frontMatter } = useConfig();
        const systemTheme = "light";
        const fullUrl =
            router.asPath === "/" ? SITE_ROOT : `${SITE_ROOT}/${router.asPath}`;

        let section = "sPhil";
        if (router?.pathname.startsWith("/hegel")) {
            section = "Hegel";
        }
        if (router?.pathname.startsWith("/kant")) {
            section = "Kant";
        }
        if (router?.pathname.startsWith("/spinoza")) {
            section = "Spinoza";
        }

        const defaultTitle = frontMatter.seoTitle || frontMatter.title || "";
        const defaultTitleString = defaultTitle ? `${defaultTitle} – ` : "";
        const titleTemplate = `${defaultTitleString}${section}`;

        return (
            <>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href={`/images/favicon-${systemTheme}/apple-touch-icon.png`}
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href={`/images/favicon-${systemTheme}/favicon-32x32.png`}
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href={`/images/favicon-${systemTheme}/favicon-16x16.png`}
                />
                <link
                    rel="mask-icon"
                    href={`/images/favicon-${systemTheme}/safari-pinned-tab.svg`}
                    color="#FFFFFF"
                />
                <link
                    rel="shortcut icon"
                    href={`/images/favicon-${systemTheme}/favicon.ico`}
                />
                <meta name="msapplication-TileColor" content="#FFFFFF" />
                <meta name="theme-color" content="#FFF" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={fullUrl} />
                <link rel="canonical" href={fullUrl} />
                <meta
                    name="image"
                    property="og:image"
                    content={`${SITE_ROOT}/og-image.png`}
                />
                <meta property="og:locale" content="en_IE" />
                <meta property="og:site_name" content="sPhil" />
                <meta
                    name="description"
                    property="og:description"
                    content={
                        frontMatter.description ||
                        "Where Philosophy Meets Open Collaboration"
                    }
                />
                <meta
                    name="title"
                    property="og:title"
                    content={titleTemplate}
                />
                <title>{titleTemplate}</title>
            </>
        );
    },
    // main: ArticleWrapper,
    navbar: {
        component: Navigation,
    },
    color: {
        hue: {
            dark: 155,
            light: 215,
        },
    },
    search: {
        placeholder: "Search encyclopaedia…",
    },
    toc: {
        backToTop: true,
        extraContent: <TableOfContentsExtra />,
    },
};

export default config;
