import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const isProduction =
        process.env.NEXT_PUBLIC_SITE_ROOT === "https://sphil.xyz";

    if (!isProduction) {
        return {
            rules: [
                {
                    userAgent: "*",
                    disallow: ["/"],
                },
            ],
        };
    }

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: ["/api/", "/admin/"],
            },
        ],
        sitemap: `${process.env.NEXT_PUBLIC_SITE_ROOT}/sitemap.xml`,
    };
}
