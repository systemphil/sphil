"use client";

import cn from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseIcon, GitHubIcon, MenuIcon } from "lib/components/mdx/icons";
import { NavbarHeader } from "lib/components/navigation/NavbarHeader";
import { UserMenu } from "lib/components/navigation/UserMenu";
import { PROJECT_LINK } from "lib/config/consts";
import { NAVBAR_LINKS } from "lib/config/navigation";
import { MuiThemeProvider } from "lib/style/MuiThemeProvider";
import { useMobileNav } from "./MobileNavContext";
import { SearchDialog } from "./SearchDialog";
import { ThemeSwitch } from "./ThemeSwitch";

const LINK_CLASSES = cn(
    "text-sm whitespace-nowrap contrast-more:text-gray-700 contrast-more:dark:text-gray-100",
    "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-200",
    "ring-inset transition-colors"
);

/**
 * Site navbar for every route. Replaces `nextra-theme-docs`' `Navbar` plus
 * the `app/_meta.ts` page-map entries that fed it.
 */
export function Navbar() {
    const pathname = usePathname();
    const { isOpen, toggle } = useMobileNav();

    return (
        <header
            className={cn(
                "docs-navbar sticky top-0 z-30 w-full bg-transparent print:hidden"
            )}
        >
            <div
                className={cn(
                    "absolute -z-1 size-full",
                    "docs-border border-b",
                    "backdrop-blur-md bg-white/70 dark:bg-neutral-950/70"
                )}
            />
            <nav
                style={{ height: "var(--docs-navbar-height)" }}
                className={cn(
                    "mx-auto flex max-w-(--docs-content-width) items-center gap-4",
                    "pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]",
                    "justify-end"
                )}
            >
                <div className="flex items-center me-auto">
                    <NavbarHeader />
                </div>

                <div className="flex gap-4 overflow-x-auto docs-scrollbar py-1.5 max-md:hidden">
                    {NAVBAR_LINKS.map((item) => {
                        const isCurrent =
                            item.href === pathname ||
                            pathname.startsWith(`${item.href}/`) ||
                            undefined;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isCurrent}
                                className={cn(
                                    LINK_CLASSES,
                                    "aria-[current]:font-medium aria-[current]:subpixel-antialiased aria-[current]:text-current"
                                )}
                            >
                                {item.title}
                            </Link>
                        );
                    })}
                </div>

                <SearchDialog className="max-md:hidden" />

                <a
                    href={PROJECT_LINK}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Project repository"
                    className={cn(LINK_CLASSES, "max-md:hidden")}
                >
                    <GitHubIcon height="24" />
                </a>

                <div className="flex justify-center items-center">
                    <ThemeSwitch lite className="ml-0" />
                    <div className="w-[70px] flex justify-center">
                        <MuiThemeProvider>
                            <UserMenu />
                        </MuiThemeProvider>
                    </div>
                </div>

                <button
                    type="button"
                    aria-label={isOpen ? "Close menu" : "Menu"}
                    aria-expanded={isOpen}
                    onClick={toggle}
                    className={cn(
                        "docs-focus cursor-pointer rounded p-1 md:hidden",
                        "text-gray-600 dark:text-gray-400",
                        isOpen && "bg-gray-400/20"
                    )}
                >
                    {isOpen ? (
                        <CloseIcon height="24" />
                    ) : (
                        <MenuIcon height="24" />
                    )}
                </button>
            </nav>
        </header>
    );
}
