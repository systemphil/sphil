import { SITE_ROOT } from "lib/config/consts";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/courses$"],
                disallow: ["/api/", "/courses/", "/admin/"],
            },
        ],
        sitemap: `${SITE_ROOT}/sitemap.xml`,
    };
}
