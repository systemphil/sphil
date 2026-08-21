"use client";

import cn from "clsx";
import { type ComponentProps, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

type PreProps = ComponentProps<"pre"> & {
    "data-filename"?: string;
    "data-copy"?: string;
    "data-pagefind-ignore"?: string;
};

const BORDER = cn(
    "border border-gray-300 dark:border-neutral-700",
    "contrast-more:border-gray-900 contrast-more:dark:border-gray-50"
);

/**
 * Code block wrapper with a copy button — the replacement for Nextra's
 * `defaultShowCopyCode: true`.
 */
export function Pre({
    children,
    className,
    "data-filename": filename,
    "data-copy": copy,
    "data-pagefind-ignore": pagefindIgnore,
    ...props
}: PreProps) {
    const preRef = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const text = preRef.current?.querySelector("code")?.textContent ?? "";
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard unavailable (insecure context) — nothing to do.
        }
    };

    const copyButton = copy === "" && (
        <button
            type="button"
            aria-label={copied ? "Copied" : "Copy code"}
            title={copied ? "Copied" : "Copy code"}
            onClick={handleCopy}
            className={cn(
                "cursor-pointer rounded-md p-1.5 transition",
                "bg-white dark:bg-neutral-900",
                BORDER,
                "hover:bg-gray-100 dark:hover:bg-neutral-800"
            )}
        >
            {copied ? <CheckIcon height="1em" /> : <CopyIcon height="1em" />}
        </button>
    );

    return (
        <div
            data-pagefind-ignore={pagefindIgnore}
            className="docs-code relative not-first:mt-[1.25em]"
        >
            {filename && (
                <div
                    className={cn(
                        "px-4 text-xs text-gray-700 dark:text-gray-200",
                        "bg-gray-100 dark:bg-neutral-900",
                        "flex items-center h-12 gap-2 rounded-t-md",
                        BORDER,
                        "border-b-0"
                    )}
                >
                    <span className="truncate">{filename}</span>
                </div>
            )}
            <pre
                ref={preRef}
                className={cn(
                    "group",
                    "overflow-x-auto subpixel-antialiased text-[.9em]",
                    "bg-white dark:bg-black py-4",
                    "ring-1 ring-inset ring-gray-300 dark:ring-neutral-700",
                    "contrast-more:ring-gray-900 contrast-more:dark:ring-gray-50",
                    filename ? "rounded-b-md" : "rounded-md",
                    "not-prose",
                    className
                )}
                {...props}
            >
                <div
                    className={cn(
                        "opacity-0 transition focus-within:opacity-100",
                        "group-hover:opacity-100 group-focus:opacity-100",
                        "flex gap-1 absolute right-4",
                        filename ? "top-14" : "top-2"
                    )}
                >
                    {copyButton}
                </div>
                {children}
            </pre>
        </div>
    );
}
