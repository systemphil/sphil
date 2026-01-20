import type { Metadata } from "next";
import {
    Footer as NextraFooter,
    Layout as NextraLayout,
    Link as NextraLink,
    Navbar as NextraNavbar,
    ThemeSwitch,
} from "nextra-theme-docs";
import { Banner as NextraBanner, Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { UserMenu } from "lib/components/navigation/UserMenu";
import { Footer } from "lib/components/navigation/Footer";
import { NavbarHeader } from "lib/components/navigation/NavbarHeader";
import { TableOfContentsExtra } from "lib/components/navigation/TableOfContentsExtra";
import { ArticleWrapper } from "lib/components/ui/ArticleWrapper";
import { Providers } from "lib/components/context/Providers";
import "nextra-theme-docs/style.css";
import "@mdxeditor/editor/style.css";
import "./globals.css";
import { Suspense } from "react";
import { ImagePreloader } from "lib/components/ImagePreloader";
import { MuiThemeProvider } from "lib/style/MuiThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { cn } from "lib/utils";
import {
    DESCRIPTION,
    DOCS_REPOSITORY_BASE,
    EDIT_LINK_DESCRIPTION,
    OG_IMAGES,
    PROJECT_LINK,
    SITE_ROOT,
    TITLE,
} from "lib/config/consts";
import { KEYWORDS } from "lib/config/keywords";

export const metadata: Metadata = {
    title: {
        absolute: TITLE,
        template: "%s | sPhil",
    },
    robots: "index, follow",
    description: DESCRIPTION,
    metadataBase: new URL(SITE_ROOT),
    keywords: KEYWORDS,
    generator: "Next.js",
    applicationName: TITLE,
    appleWebApp: {
        title: TITLE,
    },
    alternates: {
        canonical: SITE_ROOT,
    },
    other: {
        "msapplication-TileColor": "#fff",
    },
    twitter: {
        card: "summary_large_image",
        site: "@sphildotxyz",
        creator: "@sphildotxyz",
        description: DESCRIPTION,
        title: TITLE,
        images: OG_IMAGES,
    },
    authors: {
        name: TITLE,
    },
    creator: TITLE,
    publisher: TITLE,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    category: "education",
    openGraph: {
        title: TITLE,
        type: "website",
        locale: "en_US",
        siteName: TITLE,
        description: DESCRIPTION,
        url: SITE_ROOT,
        images: OG_IMAGES,
    },
};

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "sPhil",
    description: DESCRIPTION,
    url: SITE_ROOT,
    email: "service@systemphil.com",
    sameAs: [
        "https://www.facebook.com/profile.php?id=61564840656103",
        "https://www.youtube.com/@sphildotxyz",
        "https://bsky.app/profile/sphil.xyz",
        "https://twitter.com/sphildotxyz",
        "https://github.com/systemphil",
        "https://www.linkedin.com/company/sphil",
    ],
    educationalLevel: "Higher Education",
    teaches: [
        "Philosophy",
        "Literature",
        "History",
        "Classical Studies",
        "Humanities",
    ],
    audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const toc: {
        float?: boolean;
        backToTop?: React.ReactNode;
        extraContent?: React.ReactNode;
        title?: React.ReactNode;
    } = {
        extraContent: <TableOfContentsExtra />,
    };
    const feedbackOptions = {
        content: null, // disables the feedback link to github issues
    };

    return (
        <html
            lang="en"
            dir="ltr"
            suppressHydrationWarning
            className={cn("nextra-scrollbar", roboto.variable)}
            data-theme="fantasy"
        >
            <head>
                <script
                    type="application/ld+json"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <Controlled>
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                    }}
                />
            </head>
            <body>
                <Suspense>
                    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                        <Providers>
                            <NextraLayout
                                feedback={feedbackOptions}
                                pageMap={await getPageMap()}
                                docsRepositoryBase={DOCS_REPOSITORY_BASE}
                                editLink={EDIT_LINK_DESCRIPTION}
                                sidebar={{ defaultMenuCollapseLevel: 1 }}
                                search={
                                    <Search placeholder="Search the Encyclopaedia…" />
                                }
                                // banner={<Banner />}
                                navbar={
                                    <NextraNavbar
                                        logoLink={false}
                                        logo={<NavbarHeader />}
                                        projectLink={PROJECT_LINK}
                                    >
                                        <div className="flex justify-center items-center">
                                            <ThemeSwitch
                                                lite={true}
                                                className="ml-0"
                                            />
                                            <div className="w-[70px] flex justify-center">
                                                <MuiThemeProvider>
                                                    <UserMenu />
                                                </MuiThemeProvider>
                                            </div>
                                        </div>
                                    </NextraNavbar>
                                }
                                footer={
                                    <div
                                        className="relative"
                                        key="footer-key-123"
                                    >
                                        <div
                                            data-name="footer-flair"
                                            className="absolute h-20 w-full -top-[80px] bg-linear-to-t from-[#fff6f6] to-transparent dark:from-[#10b981] pointer-events-none opacity-10 z-10"
                                        />
                                        <NextraFooter className="flex-col items-center md:items-start relative">
                                            <Footer />
                                        </NextraFooter>
                                    </div>
                                }
                                toc={toc}
                            >
                                <MuiThemeProvider>
                                    <ArticleWrapper>{children}</ArticleWrapper>
                                </MuiThemeProvider>
                            </NextraLayout>
                        </Providers>
                        <Suspense>
                            <ImagePreloader />
                        </Suspense>
                    </AppRouterCacheProvider>
                </Suspense>
            </body>
        </html>
    );
}

// biome-ignore lint/correctness/noUnusedVariables: <Planned to be used later>
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
