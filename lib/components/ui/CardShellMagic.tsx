"use client";

import { ReactNode } from "react";
import { cn } from "lib/utils";

/**
 * In order for Card to animate the pseudo-background, it must access certain CSS properties exposed via the Houdini API,
 * which is not available(?) in TailwindCSS.
 * Therefore, a special CSS class "card-magic" was made to achieve this. This class only does the fancy animation
 * styling, leaving the rest, such as size and background, to be handled by Tailwind as per usual.
 * @See {@Link https://developer.mozilla.org/en-US/articles/Web/Guide/Houdini CSS Houdini}
 */
export function CardShellMagic({ children }: { children?: ReactNode }) {
    return (
        <div
            className={cn(
                "card-magic",
                "h-[35vh] sm:aspect-4/3 card-magic border hover:border-hidden rounded-md flex flex-col items-center justify-center",
                "dark:border-slate-900 bg-linear-to-b from-gray-50/90 to-gray-100/90 dark:from-neutral-950/90 dark:to-neutral-800/90",
                "hover:from-gray-50 hover:to-gray-100 dark:hover:from-neutral-950  dark:hover:to-neutral-800"
            )}
        >
            {children}
        </div>
    );
}
