import { SITE_ROOT } from "lib/config/consts";
import type { MetadataRoute } from "next";

// TODO finish this
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: SITE_ROOT,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 1,
        },
        {
            url: `${SITE_ROOT}/courses`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.9,
        },
        {
            url: `${SITE_ROOT}/articles/articles`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.9,
        },
        {
            url: `${SITE_ROOT}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        },
    ];
}
