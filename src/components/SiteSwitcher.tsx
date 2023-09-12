import cn from "classnames";
import { useRouter } from "next/router";
import Link from "next/link";

export type SphilSite = "hegel" | "kant";

export function useSphilSite(): SphilSite | undefined {
    const { pathname } = useRouter();

    if (pathname.startsWith("/hegel")) {
        return "hegel";
    }

    if (pathname.startsWith("/kant")) {
        return "kant";
    }

    return undefined;
}

function SiteSwitcherLink({ 
    href, text, isActive
}: { 
    href: string, text: string, isActive: boolean
}) {
    const classes = "py-1 transition-colors duration-300 inline-block w-[50px] cursor-pointer hover:text-black dark:hover:text-white";
    const conditionalClasses = {
        "text-black dark:text-white": !!isActive,
    };

    return(
        <Link href={href} className={cn(classes, conditionalClasses)}>
            {text}
        </Link>
    );
}

function SiteSwitcher() {
    const site = useSphilSite();

    return(
        <div className="relative flex items-center justify-between p-2 text-xl group">
            <span 
                className={cn(
                    "flex h-[34px] w-[100px] flex-shrink-0 items-center rounded-[8px] border border-[#dedfde] dark:border-[#333333] p-1 duration-300 ease-in-out",
                    "after:h-[24px] after:w-[44px] after:rounded-md dark:after:bg-[#52ffb7] dark:after:bg-opacity-30 after:shadow-sm after:duration-300 after:border dark:after:border-[#333333] after:border-[#666666]/100 after:bg-gradient-to-b after:from-[#324ff1] after:to-[#c24a7a] after:opacity-20 dark:after:opacity-100 dark:after:bg-none",
                    "indeterminate:after:hidden",
                    {
                      "after:hidden": !site,
                      "after:translate-x-[46px]": site === "kant",
                    }
                  )}
            />

            <span
                className={cn(
                    "z-50 absolute p-1 text-sm flex justify-between text-center w-[100px] text-[#666666] dark:text-[#888888]",
                    { "hover:text-black dark:hover:text-white": site }
                )}
            >
                <SiteSwitcherLink href="/hegel" text="Hegel" isActive={site === "hegel"} />
                <SiteSwitcherLink href="/kant" text="Kant" isActive={site === "kant"} />
            </span>
        </div>
    );
}

export default SiteSwitcher;