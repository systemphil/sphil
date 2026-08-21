import cn from "clsx";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowRightIcon } from "lib/components/mdx/icons";
import { ENCYCLOPAEDIA_ROOT } from "lib/config/navigation";
import type { TreeNode } from "lib/content/types";

type Crumb = { key: string; title: React.ReactNode; href: string };

/**
 * Breadcrumb trail, rooted at the Encyclopaedia. A node whose first child is
 * the next crumb is rendered unlinked, matching Nextra's behaviour.
 */
export function Breadcrumbs({ nodes }: { nodes: TreeNode[] }) {
    const crumbs: Crumb[] = [
        {
            key: ENCYCLOPAEDIA_ROOT.route,
            title: ENCYCLOPAEDIA_ROOT.title,
            href: ENCYCLOPAEDIA_ROOT.route,
        },
        ...nodes.map((node, index) => {
            const next = nodes[index + 1];
            const href =
                !next || node.children?.[0]?.route === next.route
                    ? ""
                    : ((node.hasPage
                          ? node.route
                          : node.children?.[0]?.route) ?? "");
            return {
                key: `${node.route}-${node.name}`,
                title: node.title,
                href,
            };
        }),
    ];

    return (
        <div
            className={cn(
                "docs-breadcrumb mt-1.5 flex items-center gap-1 overflow-hidden text-sm",
                "text-gray-600 dark:text-gray-400 contrast-more:text-current"
            )}
        >
            {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                const classes = cn(
                    "whitespace-nowrap transition-colors",
                    isLast
                        ? "font-medium text-black dark:text-gray-100"
                        : "min-w-6 overflow-hidden text-ellipsis",
                    crumb.href &&
                        "docs-focus ring-inset hover:text-gray-900 dark:hover:text-gray-100"
                );

                return (
                    <Fragment key={crumb.key}>
                        {index > 0 && (
                            <ArrowRightIcon height="14" className="shrink-0" />
                        )}
                        {crumb.href && !isLast ? (
                            <Link
                                href={crumb.href}
                                prefetch={false}
                                className={classes}
                                title={
                                    typeof crumb.title === "string"
                                        ? crumb.title
                                        : undefined
                                }
                            >
                                {crumb.title}
                            </Link>
                        ) : (
                            <span
                                className={classes}
                                title={
                                    typeof crumb.title === "string"
                                        ? crumb.title
                                        : undefined
                                }
                            >
                                {crumb.title}
                            </span>
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
}
