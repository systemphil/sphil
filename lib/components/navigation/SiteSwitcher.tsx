"use client";

import { useSphilSite } from "lib/hooks/useSphilSite";
import { cn } from "lib/utils";
import Link from "next/link";

function SiteSwitcherLink({
    href,
    text,
    isActive,
}: {
    href: string;
    text: string;
    isActive: boolean;
}) {
    const classes =
        "py-1 transition-colors duration-300 inline-block w-[50px] cursor-pointer hover:text-black dark:hover:text-white";
    const conditionalClasses = {
        "text-black dark:text-white": !!isActive,
    };

    return (
        <Link href={href} className={cn(classes, conditionalClasses)}>
            {text}
        </Link>
    );
}

export function SiteSwitcher() {
    const site = useSphilSite();
    // old dark-background config: dark:after:bg-[#52ffb7] dark:after:bg-opacity-30

    return (
        <div className="relative flex items-center justify-between p-2 text-xl group">
            <span
                className={cn(
                    "flex h-[34px] w-[206px] shrink-0 items-center rounded-[8px] border border-[#dedfde] dark:border-[#333333] p-1 duration-300 ease-in-out",
                    "after:h-[24px] after:w-[50px] after:rounded-md dark:after:bg-dark-green-hsl after:shadow-xs after:duration-300 after:border dark:after:border-[#333333] after:border-[#666666]/100 after:bg-linear-to-b after:from-[#32a1f1] after:to-[#40b44e] after:opacity-20 dark:after:opacity-100 dark:after:bg-none",
                    "indeterminate:after:hidden",
                    {
                        "after:hidden": !site,
                        "after:translate-x-[72px] after:w-[46px] after:bg-linear-to-r after:from-[#334ff3] after:to-[#c34879]":
                            site === "kant",
                        "after:translate-x-[136px] after:w-[59px] after:bg-linear-to-b after:from-[#ebc031] after:to-[#cf464f]":
                            site === "spinoza",
                    }
                )}
            />
            <span className="z-50 absolute p-1 text-sm flex justify-between text-center w-[200px] text-[#666666] dark:text-[#888888]">
                <SiteSwitcherLink
                    href="/articles/hegel"
                    text="Hegel"
                    isActive={site === "hegel"}
                />
                <SiteSwitcherLink
                    href="/articles/kant"
                    text="Kant"
                    isActive={site === "kant"}
                />
                <SiteSwitcherLink
                    href="/articles/spinoza"
                    text="Spinoza"
                    isActive={site === "spinoza"}
                />
            </span>
        </div>
    );
}
