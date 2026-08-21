import cn from "clsx";
import { License } from "lib/components/License";
import type { Article } from "lib/content/compile";
import type { ThemeFlags, TreeNode } from "lib/content/types";
import { Breadcrumbs } from "./Breadcrumbs";
import { SidebarNav } from "./Sidebar";
import { Toc } from "./Toc";

type ArticleShellProps = {
    article: Article;
    theme: Required<ThemeFlags>;
    sidebarNodes: TreeNode[];
    breadcrumb: TreeNode[];
};

/**
 * Docs shell: sidebar, article column and table-of-contents rail. Replaces
 * `nextra-theme-docs`' MDX `wrapper`, including the `data-pagefind-body`
 * marker that decides what the pagefind index picks up.
 */
export function ArticleShell({
    article,
    theme,
    sidebarNodes,
    breadcrumb,
}: ArticleShellProps) {
    const showSidebar = theme.sidebar && sidebarNodes.length > 0;

    return (
        <>
            {showSidebar && (
                <aside
                    className={cn(
                        "docs-sidebar print:hidden max-md:hidden flex flex-col",
                        "h-[calc(100dvh-var(--docs-navbar-height))]",
                        "top-(--docs-navbar-height) shrink-0 w-64 sticky"
                    )}
                >
                    <div className="p-4 overflow-y-auto docs-scrollbar docs-mask">
                        <SidebarNav nodes={sidebarNodes} />
                    </div>
                </aside>
            )}

            {theme.toc && (
                <nav
                    className="docs-toc order-last max-xl:hidden w-64 shrink-0 print:hidden"
                    aria-label="table of contents"
                >
                    <Toc toc={article.toc} filePath={article.filePath} />
                </nav>
            )}

            <article
                className={cn(
                    "w-full min-w-0 break-words min-h-[calc(100vh-var(--docs-navbar-height))]",
                    "text-slate-700 dark:text-slate-200 pb-8 px-4 pt-4 md:px-12",
                    theme.typesetting === "article" &&
                        "docs-typesetting-article"
                )}
            >
                {theme.breadcrumb && breadcrumb.length > 0 && (
                    <Breadcrumbs nodes={breadcrumb} />
                )}
                <main
                    data-pagefind-body={
                        article.frontmatter.searchable !== false || undefined
                    }
                >
                    {article.content}
                </main>
                <div className="mt-16" />
                <License isArticle={article.frontmatter.isArticle === true} />
            </article>
        </>
    );
}
