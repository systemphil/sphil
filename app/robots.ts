import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const isProduction =
        process.env.NEXT_PUBLIC_SITE_ROOT === "https://sphil.xyz";

    if (!isProduction) {
        // Dev or staging: block everything
        return {
            rules: [
                {
                    userAgent: "*",
                    disallow: ["/"], // disallow all crawling
                },
            ],
            // no sitemap
        };
    }

    // Production
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/courses$"],
                disallow: ["/api/", "/courses/", "/admin/"],
            },
        ],
        sitemap: `${process.env.NEXT_PUBLIC_SITE_ROOT}/sitemap.xml`,
    };
}
