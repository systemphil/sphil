/**
 * Shared shell for /admin/courses/**. Breadcrumbs come from the @breadcrumbs
 * parallel route, whose catch-all page sees the full path, so they render in
 * the same place on every page regardless of each page's own layout.
 */
export default function AdminCoursesLayout({
    children,
    breadcrumbs,
}: {
    children: React.ReactNode;
    breadcrumbs: React.ReactNode;
}) {
    return (
        <>
            <div className="container mx-auto px-4 pt-4">{breadcrumbs}</div>
            {children}
        </>
    );
}
