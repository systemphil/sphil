"use client";

import cn from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRightIcon, GitHubIcon } from "lib/components/mdx/icons";
import { PROJECT_LINK } from "lib/config/consts";
import { ENCYCLOPAEDIA_ROOT, NAVBAR_LINKS } from "lib/config/navigation";
import type { TreeNode } from "lib/content/types";
import { useMobileNav } from "./MobileNavContext";
import { SearchDialog } from "./SearchDialog";
import { SidebarNav } from "./Sidebar";
import { ThemeSwitch } from "./ThemeSwitch";

const ITEM_CLASSES =
    "flex items-center justify-between gap-2 rounded px-2 py-2 text-base transition-colors";
const INACTIVE_CLASSES =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-gray-100/5 dark:hover:text-gray-50";
const ACTIVE_CLASSES = "font-semibold text-gray-900 dark:text-gray-50";

const isInside = (pathname: string, href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

/**
 * The Encyclopaedia entry, expanding into the full content tree. Folders
 * along the active route open themselves, so the current article is visible
 * as soon as the section is opened.
 */
function EncyclopaediaSection({
    nodes,
    pathname,
}: {
    nodes: TreeNode[];
    pathname: string;
}) {
    const active = isInside(pathname, ENCYCLOPAEDIA_ROOT.route);
    const [isOpen, setIsOpen] = useState(active);

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                className={cn(
                    ITEM_CLASSES,
                    "w-full cursor-pointer text-start",
                    active ? ACTIVE_CLASSES : INACTIVE_CLASSES
                )}
            >
                {ENCYCLOPAEDIA_ROOT.title}
                <ArrowRightIcon
                    height="18"
                    className={cn(
                        "shrink-0 origin-center transition-transform motion-reduce:transition-none",
                        isOpen && "rotate-90"
                    )}
                />
            </button>
            {isOpen && (
                <div className="ms-2 border-s docs-border ps-2">
                    <SidebarNav nodes={nodes} renderCollapsed={false} />
                </div>
            )}
        </div>
    );
}

/**
 * Slide-in navigation drawer for small screens: the site links, with the
 * Encyclopaedia expanding into the whole article tree.
 */
export function MobileNav({ nodes }: { nodes: TreeNode[] }) {
    const { isOpen, close } = useMobileNav();
    const pathname = usePathname();

    return (
        <aside
            inert={!isOpen}
            className={cn(
                "docs-mobile-nav flex flex-col",
                "fixed inset-0 pt-(--docs-navbar-height) z-20 overscroll-contain",
                "[contain:layout_style] md:hidden",
                "bg-white dark:bg-neutral-950",
                "transition-transform",
                isOpen ? "translate-y-0" : "-translate-y-full"
            )}
        >
            <div className="px-4 pt-4">
                <SearchDialog />
            </div>

            <nav
                aria-label="Site"
                className="docs-scrollbar grid content-start gap-1 overflow-y-auto px-4 pt-4 pb-4"
            >
                {NAVBAR_LINKS.map((item) =>
                    item.href === ENCYCLOPAEDIA_ROOT.route ? (
                        <EncyclopaediaSection
                            key={item.href}
                            nodes={nodes}
                            pathname={pathname}
                        />
                    ) : (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={close}
                            aria-current={
                                isInside(pathname, item.href) || undefined
                            }
                            className={cn(
                                ITEM_CLASSES,
                                isInside(pathname, item.href)
                                    ? ACTIVE_CLASSES
                                    : INACTIVE_CLASSES
                            )}
                        >
                            {item.title}
                        </Link>
                    )
                )}
            </nav>

            <div className="mx-4 mt-auto flex items-center gap-2 border-t docs-border py-4">
                <ThemeSwitch className="grow" />
                <a
                    href={PROJECT_LINK}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Project repository"
                    className="docs-focus rounded p-2 text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <GitHubIcon height="24" />
                </a>
            </div>
        </aside>
    );
}
