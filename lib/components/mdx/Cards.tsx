import cn from "clsx";
import NextLink from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

type CardProps = Omit<ComponentProps<typeof NextLink>, "title"> & {
    title: ReactNode;
    icon?: ReactNode;
    arrow?: boolean;
};

function Card({
    children,
    title,
    icon,
    arrow,
    href,
    className,
    ...props
}: CardProps) {
    return (
        <NextLink
            href={href}
            className={cn(
                "group",
                "docs-card flex flex-col justify-start overflow-hidden rounded-lg border border-gray-200",
                "text-current no-underline dark:shadow-none",
                "hover:shadow-gray-100 dark:hover:shadow-none shadow-gray-100",
                "active:shadow-sm active:shadow-gray-200",
                "transition-all duration-200 hover:border-gray-300",
                children
                    ? "bg-gray-100 shadow dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-50 hover:shadow-lg dark:hover:border-neutral-500 dark:hover:bg-neutral-700"
                    : "bg-transparent shadow-sm dark:border-neutral-800 hover:bg-slate-50 hover:shadow-md dark:hover:border-neutral-700 dark:hover:bg-neutral-900",
                className
            )}
            {...props}
        >
            {children}
            <span
                className={cn(
                    "flex font-semibold items-center gap-2 p-4 text-gray-700 hover:text-gray-900",
                    arrow && [
                        'after:content-["→"] after:transition-transform after:duration-75',
                        "group-hover:after:translate-x-0.5",
                        "group-focus:after:translate-x-0.5",
                    ],
                    children
                        ? "dark:text-gray-300 dark:hover:text-gray-100"
                        : "dark:text-neutral-200 dark:hover:text-neutral-50"
                )}
                title={typeof title === "string" ? title : undefined}
            >
                {icon}
                <span className="truncate">{title}</span>
            </span>
        </NextLink>
    );
}

type CardsProps = ComponentProps<"div"> & { num?: number };

function CardsRoot({
    children,
    num = 3,
    className,
    style,
    ...props
}: CardsProps) {
    return (
        <div
            className={cn("docs-cards mt-4 gap-4 grid", "not-prose", className)}
            style={
                {
                    ...style,
                    ["--rows" as keyof CSSProperties]: num,
                } as CSSProperties
            }
            {...props}
        >
            {children}
        </div>
    );
}

/** Ported from `nextra/components` (MIT). Keeps the compound `Cards.Card` API. */
export const Cards = Object.assign(CardsRoot, {
    displayName: "Cards",
    Card,
});
