/** Docs shell container. The catch-all page fills in sidebar/article/TOC. */
export default function ArticlesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto flex max-w-(--docs-content-width)">
            {children}
        </div>
    );
}
