import fs from "fs";
import path from "path";
import { minimatch } from "minimatch";
import type { MetadataRoute } from "next";
import { SITE_ROOT } from "lib/config/consts";
import { dbGetAllPublishedCourses } from "lib/database/dbFuncs";
import { generateStaticParamsFor } from "nextra/pages";

const siteConfig = {
    baseUrl: SITE_ROOT,
    // Only exclude admin routes and test pages
    excludePages: ["/admin", "/admin/*", "/test"],
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const isProduction =
        process.env.NEXT_PUBLIC_SITE_ROOT === "https://sphil.xyz";

    if (!isProduction) {
        return [];
    }

    const staticRoutes = getStaticRoutes();

    console.log("All static routes found:", staticRoutes);

    // Filter out excluded routes and extract just the route strings
    const filteredRoutes = staticRoutes
        .filter((routeInfo) => !shouldExcludeRoute(routeInfo.route))
        .map((routeInfo) => routeInfo.route);

    console.log("Filtered routes:", filteredRoutes);

    // Get dynamic routes
    const dynamicRoutes = await getDynamicRoutes();
    const customRoutes = await getCustomRoutes();
    const articleRoutes = await getArticleRoutes();

    // Combine all routes
    const allRoutes = [
        ...filteredRoutes,
        ...dynamicRoutes,
        ...customRoutes,
        ...articleRoutes,
    ];

    // Remove duplicates and sort
    const uniqueRoutes = Array.from(new Set(allRoutes)).sort();

    console.log("Final routes for sitemap:", uniqueRoutes);

    return uniqueRoutes.map(convertRouteToSitemapEntry);
}

async function getArticleRoutes(): Promise<string[]> {
    try {
        // Get the static params generator from Nextra
        const generateParams = generateStaticParamsFor("mdxPath");

        // Call it to get all the article paths
        const params = await generateParams();

        // Convert the params to routes
        const routes = params.map((param) => {
            // mdxPath is an array of path segments
            const pathSegments = Array.isArray(param.mdxPath)
                ? param.mdxPath
                : [param.mdxPath];
            return `/articles/${pathSegments.join("/")}`;
        });

        console.log("Article routes from Nextra:", routes);
        return routes;
    } catch (error) {
        console.error("Error generating article routes:", error);
        return [];
    }
}

// Check if a route should be excluded based on patterns
function shouldExcludeRoute(route: string): boolean {
    return (siteConfig.excludePages ?? []).some((pattern) => {
        // Exact match
        if (pattern === route) return true;

        // Glob pattern match
        if (pattern.includes("*")) {
            return minimatch(route, pattern);
        }

        // Prefix match (e.g., /admin matches /admin/*)
        if (route.startsWith(pattern + "/")) return true;

        return false;
    });
}

// Track physical directory structure to build correct file paths
interface RouteInfo {
    route: string; // URL route like /courses/[courseSlug]
    physicalPath: string; // Actual directory path like app/courses/[courseSlug]
}

// Recursively collect all pages with `page.tsx` or `page.jsx`
function getStaticRoutes(
    dir = "app",
    parentPath = "",
    parentPhysicalPath = ""
): RouteInfo[] {
    const currentDir = path.join(process.cwd(), dir);

    if (!fs.existsSync(currentDir)) {
        return [];
    }

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    let routes: RouteInfo[] = [];

    for (const entry of entries) {
        // Ignore optional catch-all, slots, and special Next.js files
        if (entry.name.startsWith("[[")) continue;
        if (entry.name.startsWith("@")) continue;
        if (entry.name === "api") continue;
        if (entry.name.startsWith("_")) continue;

        // Skip dynamic segments - we handle these separately
        if (entry.name.startsWith("[") && entry.name.endsWith("]")) continue;

        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
            // Strip out parentheses folders like (protected) from URL
            const segmentName =
                entry.name.startsWith("(") && entry.name.endsWith(")")
                    ? "" // omit segment entirely from URL
                    : entry.name;

            const routePath = segmentName
                ? parentPath
                    ? `${parentPath}/${segmentName}`
                    : segmentName
                : parentPath;

            // Physical path always includes the actual directory name
            const physicalPath = parentPhysicalPath
                ? `${parentPhysicalPath}/${entry.name}`
                : entry.name;

            const hasPage = ["page.tsx", "page.jsx", "page.ts", "page.js"].some(
                (file) => fs.existsSync(path.join(fullPath, file))
            );

            if (hasPage) {
                const normalizedRoute = `/${routePath}`;
                routes.push({
                    route: normalizedRoute,
                    physicalPath: physicalPath,
                });
            }

            const nestedRoutes = getStaticRoutes(
                path.join(dir, entry.name),
                routePath,
                physicalPath
            );

            routes = routes.concat(nestedRoutes);
        }
    }

    // Add root route
    if (parentPath === "") {
        const hasRootPage = ["page.tsx", "page.jsx", "page.ts", "page.js"].some(
            (file) => fs.existsSync(path.join(currentDir, file))
        );

        if (hasRootPage) {
            return [{ route: "/", physicalPath: "" }, ...routes];
        }
    }

    return routes;
}

// Get dynamic routes by fetching data from database
async function getDynamicRoutes(): Promise<string[]> {
    const routes: string[] = [];

    try {
        // Fetch courses from your database
        const courses = await dbGetAllPublishedCourses();

        for (const course of courses) {
            routes.push(`/courses/${course.slug}`);
        }

        console.log("Dynamic course routes generated:", routes);
    } catch (error) {
        console.error("Error fetching dynamic routes:", error);
    }

    return routes;
}

async function getCustomRoutes(): Promise<string[]> {
    // Add any custom routes here if needed
    const routes: string[] = [];
    return routes;
}

function convertRouteToSitemapEntry(route: string): {
    url: string;
    lastModified: string;
    priority: number;
} {
    return {
        url: `${siteConfig.baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        priority: route === "/" ? 1 : 0.8,
    };
}
