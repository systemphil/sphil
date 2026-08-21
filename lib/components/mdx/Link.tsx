import cn from "clsx";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { LinkArrowIcon } from "./icons";

const EXTERNAL_URL_RE = /^https?:\/\//;

export type AnchorProps = ComponentProps<"a"> & { prefetch?: boolean };

/**
 * Anchor used across MDX content. Ported from `nextra`'s `Anchor` +
 * `nextra-theme-docs`'s `Link` (MIT): hash links stay plain anchors, external
 * links open in a new tab with a small ↗ affordance, everything else routes
 * through `next/link`.
 */
export function Link({
    href = "",
    className,
    prefetch,
    ...props
}: AnchorProps) {
    const classes = cn(
        "underline hover:no-underline decoration-from-font [text-underline-position:from-font]",
        className
    );

    if (href.startsWith("#")) {
        return <a href={href} className={classes} {...props} />;
    }

    if (EXTERNAL_URL_RE.test(href)) {
        const { children } = props;
        return (
            <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className={classes}
                {...props}
            >
                {children}
                {typeof children === "string" && (
                    <>
                        &nbsp;
                        <LinkArrowIcon
                            height="1em"
                            className="inline align-baseline shrink-0"
                        />
                    </>
                )}
            </a>
        );
    }

    return (
        <NextLink
            href={href}
            prefetch={prefetch}
            className={classes}
            {...props}
        />
    );
}
