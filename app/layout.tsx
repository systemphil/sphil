import type { Metadata, Viewport } from "next";
import {
    Footer as NextraFooter,
    Layout as NextraLayout,
    Link as NextraLink,
    Navbar as NextraNavbar,
} from "nextra-theme-docs";
import { Banner as NextraBanner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { type ThemeConfigProps } from "node_modules/nextra-theme-docs/dist/layout.mjs";
import { UserMenu } from "lib/components/navigation/UserMenu";
import { Footer } from "lib/components/navigation/Footer";
import { NavbarHeader } from "lib/components/navigation/NavbarHeader";
import { TableOfContentsExtra } from "lib/components/navigation/TableOfContentsExtra";
import { ArticleWrapper } from "lib/components/ui/ArticleWrapper";
import { Providers } from "lib/components/context/Providers";

// CSS
import "./globals.css";
import "nextra-theme-docs/style.css";
import "@mdxeditor/editor/style.css";

const EDIT_LINK_DESCRIPTION = "Edit this page on GitHub →";
const PROJECT_LINK = "https://github.com/systemphil/sphil";
const DOCS_REPOSITORY_BASE = "https://github.com/systemphil/sphil/tree/main";
const SITE_ROOT = process.env.NEXT_PUBLIC_SITE_ROOT as string;
const BACKGROUND_COLOR = {
    light: "#fca5a5",
    dark: "#1e40af",
};
const COLOR = {
    hue: {
        dark: 155,
        light: 215,
    },
    saturation: {
        dark: 90,
        light: 90,
    },
};

export const viewport: Viewport = Head.viewport;

export const metadata: Metadata = {
    title: {
        absolute: "sPhil",
        template: "%s | sPhil",
    },
    robots: "index, follow",
    description: "Where Philosophy Meets Open Collaboration",
    metadataBase: new URL(SITE_ROOT),
    keywords: [
        "sphil",
        "philosophy",
        "systemphil",
        "metaphysics",
        "ontology",
        "hegel",
        "kant",
    ],
    generator: "Next.js",
    applicationName: "sPhil",
    appleWebApp: {
        title: "sPhil",
    },
    alternates: {
        canonical: SITE_ROOT,
    },
    icons: {
        apple: [
            {
                media: "(prefers-color-scheme: dark)",
                url: "/images/favicon-dark/apple-touch-icon.png",
            },
            {
                media: "(prefers-color-scheme: light)",
                url: "/images/favicon-light/apple-touch-icon.png",
            },
        ],
        icon: [
            {
                media: "(prefers-color-scheme: dark)",
                url: "/images/favicon-dark/favicon-dark.svg",
                type: "image/svg+xml",
            },
            {
                media: "(prefers-color-scheme: light)",
                url: "/images/favicon-light/favicon.svg",
                type: "image/svg+xml",
            },
        ],
    },
    other: {
        "msapplication-TileColor": "#fff",
    },
    twitter: {
        site: SITE_ROOT,
        description: "Where Philosophy Meets Open Collaboration",
        title: "sPhil",
        images: [
            {
                url: "/images/og-image-sphil.avif",
                width: 1200,
                height: 630,
                alt: "sPhil",
            },
            {
                url: "/images/og-image-sphil.webp",
                width: 1200,
                height: 630,
                alt: "sPhil",
            },
            {
                url: "/images/og-image-sphil.png",
                width: 1200,
                height: 630,
                alt: "sPhil",
            },
        ],
    },
    authors: {
        name: "sPhil",
    },
    openGraph: {
        title: "sPhil",
        type: "website",
        locale: "en_US",
        siteName: "sPhil",
        description: "Where Philosophy Meets Open Collaboration",
        images: [
            {
                url: "/images/og-image-sphil.avif",
                width: 1200,
                height: 630,
                alt: "sPhil",
            },
            {
                url: "/images/og-image-sphil.webp",
                width: 1200,
                height: 630,
                alt: "sPhil",
            },
            {
                url: "/images/og-image-sphil.png",
                width: 1200,
                height: 630,
                alt: "sPhil",
            },
        ],
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const toc: Partial<ThemeConfigProps["toc"]> = {
        extraContent: <TableOfContentsExtra />,
    };
    return (
        <html
            lang="en"
            dir="ltr"
            suppressHydrationWarning
            className="nextra-scrollbar"
            data-theme="fantasy"
        >
            <Head color={COLOR}></Head>
            <body>
                <Providers>
                    <NextraLayout
                        pageMap={await getPageMap()}
                        docsRepositoryBase={DOCS_REPOSITORY_BASE}
                        editLink={EDIT_LINK_DESCRIPTION}
                        sidebar={{ defaultMenuCollapseLevel: 1 }}
                        // banner={<Banner />}
                        navbar={
                            <NextraNavbar
                                logoLink={false}
                                logo={<NavbarHeader />}
                                projectLink={PROJECT_LINK}
                            >
                                <div className="w-[70px] flex justify-center">
                                    <UserMenu />
                                </div>
                            </NextraNavbar>
                        }
                        footer={
                            <div className="relative">
                                <div
                                    data-name="footer-flair"
                                    className="absolute h-20 w-full -top-[80px] bg-gradient-to-t from-[#fff6f6] to-transparent dark:from-[#10b981] pointer-events-none opacity-10 z-10"
                                />
                                <NextraFooter className="flex-col items-center md:items-start relative">
                                    <Footer />
                                </NextraFooter>
                            </div>
                        }
                        toc={toc}
                    >
                        <ArticleWrapper>{children}</ArticleWrapper>
                    </NextraLayout>
                </Providers>
            </body>
        </html>
    );
}

const Banner = () => {
    return (
        <NextraBanner storageKey="release_key" dismissible>
            <div className='before:content-["🎉_"]'>
                BannerText{" "}
                <NextraLink href="#" className='after:content-["_→"]'>
                    Read more
                </NextraLink>
            </div>
        </NextraBanner>
    );
};
