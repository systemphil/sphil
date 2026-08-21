import cn from "clsx";
import type { ComponentProps, ReactNode } from "react";
import {
    GitHubCautionIcon,
    GitHubImportantIcon,
    GitHubNoteIcon,
    GitHubTipIcon,
    GitHubWarningIcon,
} from "./icons";

export type CalloutType =
    | "default"
    | "error"
    | "info"
    | "warning"
    | "important";

const TYPE_TO_EMOJI: Record<CalloutType, ReactNode> = {
    default: <GitHubTipIcon height=".8em" className="mt-[.3em]" />,
    error: <GitHubCautionIcon height=".8em" className="mt-[.3em]" />,
    info: <GitHubNoteIcon height=".8em" className="mt-[.3em]" />,
    warning: <GitHubWarningIcon height=".8em" className="mt-[.3em]" />,
    important: <GitHubImportantIcon height=".8em" className="mt-[.3em]" />,
};

const TYPE_TO_CLASSES: Record<CalloutType, string> = {
    default: cn(
        "bg-green-100 dark:bg-green-900/30",
        "text-green-700 dark:text-green-500",
        "border-green-700 dark:border-green-800"
    ),
    error: cn(
        "bg-red-100 dark:bg-red-900/30",
        "text-red-700 dark:text-red-500",
        "border-red-700 dark:border-red-600"
    ),
    info: cn(
        "bg-blue-100 dark:bg-blue-900/30",
        "text-blue-700 dark:text-blue-400",
        "border-blue-700 dark:border-blue-600"
    ),
    warning: cn(
        "bg-yellow-50 dark:bg-yellow-700/30",
        "text-yellow-700 dark:text-yellow-500",
        "border-yellow-700"
    ),
    important: cn(
        "bg-purple-100 dark:bg-purple-900/30",
        "text-purple-600 dark:text-purple-400",
        "border-purple-600"
    ),
};

const EMOJI_FONT = {
    fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

export type CalloutProps = ComponentProps<"div"> & {
    type?: CalloutType;
    emoji?: ReactNode;
};

/** Ported from `nextra/components` (MIT), restyled without the `x:` prefix. */
export function Callout({
    className,
    type = "default",
    emoji = TYPE_TO_EMOJI[type],
    ...props
}: CalloutProps) {
    return (
        <div
            className={cn(
                "docs-callout overflow-x-auto not-first:mt-[1.25em] flex rounded-lg border py-[.5em] pe-[1em]",
                TYPE_TO_CLASSES[type]
            )}
        >
            <div
                className="select-none text-[1.25em] ps-[.6em] pe-[.4em]"
                style={EMOJI_FONT}
                data-pagefind-ignore="all"
            >
                {emoji}
            </div>
            <div className={cn("w-full min-w-0", className)} {...props} />
        </div>
    );
}
