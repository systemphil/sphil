"use client";

import cn from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "lib/components/mdx/icons";
import type { TreeNode } from "lib/content/types";

const classes = {
    link: cn(
        "flex rounded px-2 py-1.5 text-sm transition-colors [word-break:break-word]",
        "cursor-pointer contrast-more:border"
    ),
    inactive: cn(
        "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        "dark:text-neutral-400 dark:hover:bg-gray-100/5 dark:hover:text-gray-50",
        "contrast-more:text-gray-900 contrast-more:dark:text-gray-50",
        "contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
    ),
    active: "font-semibold text-gray-900 dark:text-gray-50",
    list: "grid gap-1",
    border: cn(
        "relative before:absolute before:inset-y-1",
        'before:w-px before:bg-gray-200 before:content-[""] dark:before:bg-neutral-800',
        "ps-3 before:start-0 pt-1 ms-3"
    ),
};

const isInside = (pathname: string, route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

function Folder({
    node,
    pathname,
    renderCollapsed,
}: {
    node: TreeNode;
    pathname: string;
    renderCollapsed: boolean;
}) {
    const activeInside = isInside(pathname, node.route);
    const [isOpen, setIsOpen] = useState(activeInside);

    // Keep the active branch expanded when navigating within the sidebar.
    useEffect(() => {
        if (activeInside) setIsOpen(true);
    }, [activeInside]);

    return (
        <li className={cn(isOpen && "open")}>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                className={cn(
                    classes.link,
                    "items-center justify-between gap-2 text-start w-full",
                    activeInside ? classes.active : classes.inactive
                )}
            >
                {node.title}
                <ArrowRightIcon
                    height="18"
                    className={cn(
                        "shrink-0 rounded-sm p-0.5",
                        "hover:bg-gray-800/5 dark:hover:bg-gray-100/5",
                        "motion-reduce:transition-none origin-center transition-all",
                        isOpen && "rotate-90"
                    )}
                />
            </button>
            {node.children && (isOpen || renderCollapsed) && (
                // In the sidebar, collapsed folders stay in the DOM (as
                // Nextra's did) so their links remain crawlable. The mobile
                // drawer duplicates that tree, so there it renders lazily.
                <div hidden={!isOpen}>
                    <Menu
                        nodes={node.children}
                        pathname={pathname}
                        renderCollapsed={renderCollapsed}
                        nested
                    />
                </div>
            )}
        </li>
    );
}

function Menu({
    nodes,
    pathname,
    renderCollapsed,
    nested = false,
}: {
    nodes: TreeNode[];
    pathname: string;
    renderCollapsed: boolean;
    nested?: boolean;
}) {
    return (
        <ul className={cn(classes.list, nested && classes.border)}>
            {nodes.map((node, index) => {
                if (node.display === "hidden") return null;

                if (node.type === "separator") {
                    return (
                        <li
                            // biome-ignore lint/suspicious/noArrayIndexKey: <Separators have no stable route>
                            key={`separator-${node.name}-${index}`}
                            className={cn(
                                node.title
                                    ? "not-first:mt-5 mb-2 px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100"
                                    : "my-4"
                            )}
                        >
                            {node.title || (
                                <hr className="mx-2 border-t docs-border" />
                            )}
                        </li>
                    );
                }

                if (node.children?.length) {
                    return (
                        <Folder
                            key={node.route}
                            node={node}
                            pathname={pathname}
                            renderCollapsed={renderCollapsed}
                        />
                    );
                }

                const active = pathname === node.route;
                return (
                    <li key={node.route}>
                        <Link
                            href={node.href ?? node.route}
                            aria-current={active || undefined}
                            className={cn(
                                classes.link,
                                active ? classes.active : classes.inactive
                            )}
                        >
                            {node.title}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

/**
 * Docs navigation. Renders the page tree built by `lib/content/tree.ts`.
 * `renderCollapsed` keeps closed folders in the DOM — wanted in the sidebar
 * for crawlability, not in the mobile drawer, which would otherwise repeat
 * the whole tree on every route.
 */
export function SidebarNav({
    nodes,
    renderCollapsed = true,
}: {
    nodes: TreeNode[];
    renderCollapsed?: boolean;
}) {
    const pathname = usePathname();
    return (
        <Menu
            nodes={nodes}
            pathname={pathname}
            renderCollapsed={renderCollapsed}
        />
    );
}
