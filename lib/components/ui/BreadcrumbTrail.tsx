import cn from "clsx";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowRightIcon } from "lib/components/mdx/icons";

export type Crumb = { key: string; title: React.ReactNode; href: string };

/**
 * Presentational breadcrumb trail. Crumbs with an empty href, and the last
 * crumb, are rendered as plain text.
 */
export function BreadcrumbTrail({
    crumbs,
    className,
    linkClassName,
}: {
    crumbs: Crumb[];
    className?: string;
    linkClassName?: string;
}) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn(
                "flex items-center gap-1 overflow-hidden text-sm",
                "text-gray-600 dark:text-gray-400 contrast-more:text-current",
                className
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
                        cn(
                            "hover:text-gray-900 dark:hover:text-gray-100",
                            linkClassName
                        )
                );
                const title =
                    typeof crumb.title === "string" ? crumb.title : undefined;

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
                                title={title}
                            >
                                {crumb.title}
                            </Link>
                        ) : (
                            <span
                                className={classes}
                                title={title}
                                aria-current={isLast ? "page" : undefined}
                            >
                                {crumb.title}
                            </span>
                        )}
                    </Fragment>
                );
            })}
        </nav>
    );
}
