import cn from "clsx";
import type { ComponentProps } from "react";
import { EmbedYT } from "lib/components/ui/EmbedYT";
import { HotTopic } from "lib/components/ui/HotTopic";
import { Stub } from "lib/components/ui/Stub";
import { EncyclopaediaLanding } from "features/marketing/components/EncyclopaediaLanding";
import { SubdirectoryLanding } from "features/marketing/components/SubdirectoryLanding";
import { Callout } from "./Callout";
import { Cards } from "./Cards";
import { FileTree } from "./FileTree";
import { H1, H2, H3, H4, H5, H6 } from "./Heading";
import { Link } from "./Link";
import { Mermaid } from "./Mermaid";
import { Pre } from "./Pre";
import { Tabs } from "./Tabs";

function Code({ className, ...props }: ComponentProps<"code">) {
    return <code className={cn("docs-code", className)} dir="ltr" {...props} />;
}

function Table({ className, ...props }: ComponentProps<"table">) {
    return (
        <table
            className={cn(
                "block overflow-x-auto docs-scrollbar not-first:mt-[1.25em] p-0",
                className
            )}
            {...props}
        />
    );
}

/**
 * Component map handed to every compiled MDX document. It replaces both the
 * per-file `import` statements that Nextra resolved at build time (stripped
 * by the content codemod) and `nextra-theme-docs`' element styling.
 */
export const mdxComponents = {
    a: Link,
    blockquote: (props: ComponentProps<"blockquote">) => (
        <blockquote
            className={cn(
                "not-first:mt-[1.25em] border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-400",
                "border-s-2 ps-[1.5em]"
            )}
            {...props}
        />
    ),
    code: Code,
    details: (props: ComponentProps<"details">) => (
        <details
            className="not-first:mt-4 rounded border border-gray-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            {...props}
        />
    ),
    summary: (props: ComponentProps<"summary">) => (
        <summary
            className="cursor-pointer select-none rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
            {...props}
        />
    ),
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    hr: (props: ComponentProps<"hr">) => (
        <hr className="my-[2em] docs-border" {...props} />
    ),
    li: (props: ComponentProps<"li">) => (
        <li className="my-[.5em]" {...props} />
    ),
    ol: (props: ComponentProps<"ol">) => (
        <ol
            className="[:is(ol,ul)_&]:my-[.75em] not-first:mt-[1.25em] list-decimal ms-6"
            {...props}
        />
    ),
    p: (props: ComponentProps<"p">) => (
        <p className="not-first:mt-[1.25em] leading-7" {...props} />
    ),
    pre: Pre,
    table: Table,
    th: (props: ComponentProps<"th">) => (
        <th
            className="m-0 border border-gray-300 px-4 py-2 font-semibold dark:border-gray-600"
            {...props}
        />
    ),
    td: (props: ComponentProps<"td">) => (
        <td
            className="m-0 border border-gray-300 px-4 py-2 dark:border-gray-600"
            {...props}
        />
    ),
    tr: (props: ComponentProps<"tr">) => (
        <tr
            className="m-0 border-t border-gray-300 p-0 dark:border-gray-600 even:bg-gray-100 even:dark:bg-gray-600/20"
            {...props}
        />
    ),
    ul: (props: ComponentProps<"ul">) => (
        <ul
            className="[:is(ol,ul)_&]:my-[.75em] not-first:mt-[1.25em] list-disc ms-[1.5em]"
            {...props}
        />
    ),
    // Components that content files used to import explicitly.
    Callout,
    Cards,
    EmbedYT,
    EncyclopaediaLanding,
    FileTree,
    HotTopic,
    Mermaid,
    Stub,
    SubdirectoryLanding,
    Tabs,
};
