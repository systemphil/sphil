/**
 * Top-level navbar links. Replaces the `app/_meta.ts` page-map hack that
 * Nextra needed to render these.
 */
export const NAVBAR_LINKS = [
    { title: "Courses 🏺", href: "/courses" },
    { title: "Encyclopaedia", href: "/articles" },
    { title: "News", href: "/newsletter" },
    { title: "About Us", href: "/about-us" },
] as const;

/** Root of the documentation section, shown as the first breadcrumb item. */
export const ENCYCLOPAEDIA_ROOT = {
    title: "Encyclopaedia",
    route: "/articles",
} as const;

export const SEARCH_PLACEHOLDER = "Search the Encyclopaedia…";
