import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { SiteFooter } from "lib/components/docs/Footer";
import { MobileNavProvider } from "lib/components/docs/MobileNavContext";
import { Navbar } from "lib/components/docs/Navbar";
import { MobileNav } from "lib/components/docs/MobileNav";
import { getPageTree } from "lib/content/tree";
import { Providers } from "lib/components/context/Providers";
import "@mdxeditor/editor/style.css";
import "./globals.css";
import { Suspense } from "react";
import { ImagePreloader } from "lib/components/ImagePreloader";
import { MuiThemeProvider } from "lib/style/MuiThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { cn } from "lib/utils";
import { DESCRIPTION, OG_IMAGES, SITE_ROOT, TITLE } from "lib/config/consts";
import { KEYWORDS } from "lib/config/keywords";
import Script from "next/script";

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
    return (
        <html
            lang="en"
            dir="ltr"
            suppressHydrationWarning
            className={cn("docs-scrollbar", roboto.variable)}
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
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="system"
                                storageKey="theme"
                                disableTransitionOnChange
                            >
                                <MobileNavProvider>
                                    <Navbar />
                                    <MobileNav nodes={getPageTree()} />
                                    <MuiThemeProvider>
                                        {children}
                                    </MuiThemeProvider>
                                    <SiteFooter />
                                </MobileNavProvider>
                            </ThemeProvider>
                        </Providers>
                        <Suspense>
                            <ImagePreloader />
                        </Suspense>
                    </AppRouterCacheProvider>
                </Suspense>

                <Script
                    src="https://r.wdfl.co/rw.js"
                    data-rewardful="5979d9"
                ></Script>
                <Script id="rewardful-queue" strategy="beforeInteractive">
                    {`(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`}
                </Script>
            </body>
        </html>
    );
}
