"use client";

import cn from "clsx";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "lib/components/mdx/icons";
import { TableOfContentsExtra } from "lib/components/navigation/TableOfContentsExtra";
import { DOCS_REPOSITORY_BASE, EDIT_LINK_DESCRIPTION } from "lib/config/consts";
import type { TocEntry } from "lib/content/types";

const LINK_CLASSES = cn(
    "text-xs font-medium transition",
    "text-gray-600 dark:text-gray-400",
    "hover:text-gray-800 dark:hover:text-gray-200",
    "contrast-more:text-gray-700 contrast-more:dark:text-gray-100"
);

const DEPTH_INDENT: Record<number, string> = {
    3: "ms-3",
    4: "ms-6",
    5: "ms-9",
    6: "ms-12",
};

/** "On This Page" rail with scroll-spy, edit link and back-to-top. */
export function Toc({ toc, filePath }: { toc: TocEntry[]; filePath: string }) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 200);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (toc.length === 0) return;

        const headings = toc
            .map((entry) => document.getElementById(entry.id))
            .filter((element): element is HTMLElement => element !== null);
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top
                    );
                if (visible[0]) setActiveId(visible[0].target.id);
            },
            { rootMargin: "-64px 0px -70% 0px", threshold: 0 }
        );

        for (const heading of headings) observer.observe(heading);
        return () => observer.disconnect();
    }, [toc]);

    return (
        <div
            className={cn(
                "grid grid-rows-[min-content_1fr_min-content]",
                "sticky top-(--docs-navbar-height) text-sm",
                "max-h-[calc(100vh-var(--docs-navbar-height))]"
            )}
        >
            {toc.length > 0 && (
                <p className="pt-6 px-4 font-semibold tracking-tight">
                    On This Page
                </p>
            )}
            <ul
                className={cn(
                    "p-4 docs-scrollbar overscroll-y-contain overflow-y-auto hyphens-auto",
                    "docs-mask"
                )}
            >
                {toc.map((entry) => (
                    <li
                        key={entry.id}
                        className={cn(
                            "my-2 scroll-my-6 scroll-py-6",
                            DEPTH_INDENT[entry.depth]
                        )}
                    >
                        <a
                            href={`#${entry.id}`}
                            className={cn(
                                "docs-focus block transition-colors subpixel-antialiased break-words",
                                entry.depth <= 2 && "font-semibold",
                                entry.id === activeId
                                    ? "text-gray-900 dark:text-gray-100"
                                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300",
                                "contrast-more:text-gray-900 contrast-more:underline contrast-more:dark:text-gray-50"
                            )}
                        >
                            {entry.value}
                        </a>
                    </li>
                ))}
            </ul>
            <div
                className={cn(
                    "grid gap-2 py-4 mx-4",
                    toc.length > 0 && "border-t docs-border"
                )}
            >
                <a
                    href={`${DOCS_REPOSITORY_BASE}/content/${filePath}`}
                    target="_blank"
                    rel="noreferrer"
                    className={cn("docs-focus", LINK_CLASSES)}
                >
                    {EDIT_LINK_DESCRIPTION}{" "}
                </a>
                <TableOfContentsExtra />
                <button
                    type="button"
                    aria-hidden={!showBackToTop}
                    disabled={!showBackToTop}
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={cn(
                        "transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                        showBackToTop ? "opacity-100" : "opacity-0",
                        LINK_CLASSES
                    )}
                >
                    Scroll to top
                    <ArrowRightIcon
                        height="1.1em"
                        className="-rotate-90 border rounded-full border-current"
                    />
                </button>
            </div>
        </div>
    );
}
