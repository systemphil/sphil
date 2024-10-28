import type { Metadata, Viewport } from "next";
import {
    Footer as NextraFooter,
    Layout as NextraLayout,
    Link as NextraLink,
    Navbar as NextraNavbar,
} from "nextra-theme-docs";
import { Banner as NextraBanner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Suspense, type ReactNode } from "react";
import "./globals.css";
import "nextra-theme-docs/style.css";
import { SessionProvider } from "next-auth/react";
import { ThemeConfigProps } from "node_modules/nextra-theme-docs/dist/layout.mjs";
import { UserMenu } from "lib/components/navigation/UserMenu";
import { Loading } from "lib/components/animations/Loading";
import { Toaster } from "react-hot-toast";
import { Footer } from "lib/components/navigation/Footer";
import { Analytics } from "lib/components/Analytics";
import { NavbarHeader } from "lib/components/navigation/NavbarHeader";
import { TableOfContentsExtra } from "lib/components/navigation/TableOfContentsExtra";

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
    },
};

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
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
            <Head
                color={COLOR}
                faviconGlyph="✦"
                // backgroundColor={BACKGROUND_COLOR}
            />
            <body>
                <SessionProvider>
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
                                    <Suspense fallback={<Loading.RingMd />}>
                                        <UserMenu />
                                    </Suspense>
                                </div>
                            </NextraNavbar>
                        }
                        footer={
                            <>
                                <div
                                    data-name="footer-flair"
                                    className=" h-20 w-full  bg-gradient-to-t from-[#fff6f6] to-transparent dark:from-[#10b981] pointer-events-none opacity-10 z-10"
                                />
                                <NextraFooter className="flex-col items-center md:items-start">
                                    <Footer />
                                </NextraFooter>
                            </>
                        }
                        toc={toc}
                    >
                        {children}
                        <Toaster position="bottom-right" />
                    </NextraLayout>
                </SessionProvider>
                <Analytics />
            </body>
        </html>
    );
}

const Banner = () => {
    return (
        <NextraBanner storageKey="4.0-release" dismissible>
            <div className='before:content-["🎉_"]'>
                Nextra 4.0 is released.{" "}
                <NextraLink href="#" className='after:content-["_→"]'>
                    Read more
                </NextraLink>
            </div>
        </NextraBanner>
    );
};
