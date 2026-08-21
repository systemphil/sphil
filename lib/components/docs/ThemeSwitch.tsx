"use client";

import cn from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { MoonIcon, SunIcon } from "lib/components/mdx/icons";

const OPTIONS = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
] as const;

/**
 * Light/dark/system switcher on `next-themes`. `lite` renders the icon only,
 * matching the navbar toggle Nextra rendered with `lite={true}`.
 */
export function ThemeSwitch({
    lite = false,
    className,
}: {
    lite?: boolean;
    className?: string;
}) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const onPointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    const current =
        OPTIONS.find((option) => option.value === theme) ?? OPTIONS[2];
    const Icon =
        (mounted ? resolvedTheme : "light") === "dark" ? MoonIcon : SunIcon;

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <button
                type="button"
                title="Change theme"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className={cn(
                    "docs-focus flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm",
                    "text-gray-600 hover:bg-gray-800/5 dark:text-gray-400 dark:hover:bg-gray-100/5",
                    "transition-colors"
                )}
            >
                <Icon height="12" />
                {!lite && <span suppressHydrationWarning>{current.label}</span>}
            </button>
            {isOpen && (
                <ul
                    className={cn(
                        "absolute end-0 z-30 mt-1 min-w-28 rounded-md py-1 text-sm shadow-lg",
                        "border border-black/5 dark:border-white/20",
                        "bg-white dark:bg-neutral-900"
                    )}
                >
                    {OPTIONS.map((option) => (
                        <li key={option.value}>
                            <button
                                type="button"
                                aria-current={option.value === theme}
                                onClick={() => {
                                    setTheme(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "block w-full cursor-pointer px-3 py-1.5 text-start transition-colors",
                                    option.value === theme
                                        ? "text-gray-900 dark:text-gray-100"
                                        : "text-gray-600 dark:text-gray-400",
                                    "hover:bg-gray-100 dark:hover:bg-neutral-800"
                                )}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
