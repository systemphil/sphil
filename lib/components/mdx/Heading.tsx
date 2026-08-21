import cn from "clsx";
import type { ComponentProps } from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const TAG_CLASSES: Record<HeadingTag, string> = {
    h1: "mt-2 text-4xl",
    h2: "mt-10 border-b pb-1 text-3xl docs-border",
    h3: "mt-8 text-2xl",
    h4: "mt-8 text-xl",
    h5: "mt-8 text-lg",
    h6: "mt-8 text-base",
};

const createHeading = (Tag: HeadingTag) =>
    function Heading({
        children,
        id,
        className,
        ...props
    }: ComponentProps<HeadingTag>) {
        const classes =
            // `sr-only` headings are added by the GFM footnotes plugin.
            className === "sr-only"
                ? "sr-only"
                : cn(
                      "tracking-tight text-slate-900 dark:text-slate-100",
                      Tag === "h1"
                          ? "font-bold"
                          : "font-semibold target:animate-[fade-in_1.5s]",
                      TAG_CLASSES[Tag],
                      className
                  );

        return (
            <Tag id={id} className={classes} {...props}>
                {children}
                {id && (
                    // biome-ignore lint/a11y/useAnchorContent: <The "#" marker is drawn with ::after; aria-label carries the meaning>
                    <a
                        href={`#${id}`}
                        className="subheading-anchor"
                        aria-label="Permalink for this section"
                    />
                )}
            </Tag>
        );
    };

export const H1 = createHeading("h1");
export const H2 = createHeading("h2");
export const H3 = createHeading("h3");
export const H4 = createHeading("h4");
export const H5 = createHeading("h5");
export const H6 = createHeading("h6");
