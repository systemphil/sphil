import type { Metadata, Viewport } from "next";
import {
    Footer as NextraFooter,
    Layout as NextraLayout,
    Link as NextraLink,
    Navbar as NextraNavbar,
} from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import type { FC, ReactNode } from "react";
import "./globals.css";
import "nextra-theme-docs/style.css";
import Footer from "@/components/Footer";
import NavbarHeader from "@/components/NavbarHeader";
import { ArticleWrapper } from "@/components/ArticleWrapper";
import Analytics from "@/components/Analytics";

const EDIT_LINK_DESCRIPTION = "Edit this page on GitHub →";
const PROJECT_LINK = "https://github.com/systemphil/sphil";
const DOCS_REPOSITORY_BASE = "https://github.com/systemphil/sphil/tree/main";
const SITE_ROOT = process.env.NEXT_PUBLIC_SITE_ROOT as string;

export const viewport: Viewport = Head.viewport;

export const metadata: Metadata = {
    description: "Make beautiful websites with Next.js & MDX.",
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
    title: {
        absolute: "",
        template: "%s | sPhil",
    },
    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: dark)",
                url: "/favicon-dark.svg",
                type: "image/svg+xml",
            },
            {
                media: "(prefers-color-scheme: light)",
                url: "/favicon.svg",
                type: "image/svg+xml",
            },
        ],
    },
    other: {
        "msapplication-TileColor": "#fff",
    },
    twitter: {
        site: SITE_ROOT,
    },
};

const RootLayout: FC<{
    children: ReactNode;
}> = async ({ children }) => {
    return (
        <html
            lang="en"
            dir="ltr"
            suppressHydrationWarning
            className="nextra-scrollbar"
        >
            <Head />
            <body>
                <NextraLayout
                    pageMap={await getPageMap()}
                    docsRepositoryBase={DOCS_REPOSITORY_BASE}
                    editLink={EDIT_LINK_DESCRIPTION}
                    sidebar={{ defaultMenuCollapseLevel: 1 }}
                >
                    <Banner storageKey="4.0-release">
                        <div className='before:content-["🎉_"]'>
                            Nextra 4.0 is released.{" "}
                            <NextraLink
                                href="#"
                                className='after:content-["_→"]'
                            >
                                Read more
                            </NextraLink>
                        </div>
                    </Banner>
                    <NextraNavbar
                        logoLink={false}
                        logo={<NavbarHeader />}
                        projectLink={PROJECT_LINK}
                    />
                    {/* <ArticleWrapper> */}
                    {children}
                    {/* </ArticleWrapper> */}
                    <NextraFooter className="flex-col items-center md:items-start">
                        <Footer />
                    </NextraFooter>
                </NextraLayout>
                <Analytics />
            </body>
        </html>
    );
};

export default RootLayout;
