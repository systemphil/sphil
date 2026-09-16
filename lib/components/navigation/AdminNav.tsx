"use client";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ViewTimelineOutlinedIcon from "@mui/icons-material/ViewTimelineOutlined";
import type { Role } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "lib/utils";

type AdminLink = {
    href: string;
    label: string;
    icon: typeof SchoolOutlinedIcon;
    /** Other path prefixes that count as this section being current. */
    matches?: string[];
    sudoOnly?: boolean;
};

const ADMIN_LINKS: AdminLink[] = [
    {
        href: "/admin",
        label: "Courses",
        icon: SchoolOutlinedIcon,
        matches: ["/admin/courses"],
    },
    { href: "/admin/planning", label: "Planning", icon: ViewTimelineOutlinedIcon },
    { href: "/admin/documents", label: "Documents", icon: DescriptionOutlinedIcon },
    {
        href: "/admin/users",
        label: "Users",
        icon: PeopleOutlinedIcon,
        sudoOnly: true,
    },
];

function isCurrent(pathname: string, link: AdminLink) {
    // "/admin" itself must match exactly, or it would own every admin route.
    if (pathname === link.href) return true;
    if (link.href !== "/admin" && pathname.startsWith(`${link.href}/`)) {
        return true;
    }
    return (link.matches ?? []).some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
}

/**
 * Secondary navbar for /admin/**. Sticks directly under the site navbar and
 * mirrors its frosted style, with a purple accent marking the admin area.
 */
export function AdminNav({ role }: { role: Role }) {
    const pathname = usePathname();
    const isSudo = role === "SUPERADMIN";

    return (
        <nav
            aria-label="Admin"
            className="sticky top-(--docs-navbar-height) z-20 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md print:hidden"
        >
            <div className="mx-auto flex h-11 max-w-(--docs-content-width) items-stretch gap-4 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                    <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18 }} />
                    <span className="max-sm:sr-only">Admin</span>
                </span>

                <span
                    aria-hidden
                    className="my-auto h-5 w-px shrink-0 bg-neutral-200 dark:bg-neutral-800"
                />

                {/* overflow-x-auto alone makes the y axis scrollable too; keep it clipped. */}
                <ul className="flex min-w-0 items-stretch gap-1 overflow-x-auto overflow-y-hidden docs-scrollbar">
                    {ADMIN_LINKS.filter((link) => isSudo || !link.sudoOnly).map(
                        (link) => {
                            const current = isCurrent(pathname, link);
                            const Icon = link.icon;

                            return (
                                <li key={link.href} className="flex">
                                    <Link
                                        href={link.href}
                                        aria-current={current ? "page" : undefined}
                                        className={cn(
                                            "relative flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-sm transition-colors",
                                            "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-100",
                                            // Underline sits just above the bar's bottom border, inside the list so it isn't clipped.
                                            "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-transparent after:transition-colors",
                                            current &&
                                                "font-medium text-black dark:text-neutral-100 after:bg-purple-500"
                                        )}
                                    >
                                        <Icon
                                            sx={{ fontSize: 18 }}
                                            className={cn(
                                                current &&
                                                    "text-purple-600 dark:text-purple-400"
                                            )}
                                        />
                                        {link.label}
                                    </Link>
                                </li>
                            );
                        }
                    )}
                </ul>

                <span className="my-auto ml-auto shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium tracking-wide text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 max-sm:hidden">
                    {isSudo ? "Super admin" : "Admin"}
                </span>
            </div>
        </nav>
    );
}
