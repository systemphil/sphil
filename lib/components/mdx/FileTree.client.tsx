"use client";

import cn from "clsx";
import { type ComponentProps, type ReactNode, useState } from "react";
import { FileIcon, FolderIcon, FolderOpenIcon } from "./icons";

type ItemProps = {
    name: ReactNode;
    active?: boolean;
};

export function File({ name, active }: ItemProps) {
    return (
        <li
            className={cn(
                "flex items-center gap-1 break-all",
                active && "font-semibold"
            )}
        >
            <FileIcon height="14" className="shrink-0" />
            {name}
        </li>
    );
}

type FolderProps = ItemProps & {
    open?: boolean;
    defaultOpen?: boolean;
    children?: ReactNode;
};

export function Folder({
    name,
    open,
    children,
    defaultOpen = false,
    active,
}: FolderProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const isFolderOpen = open === undefined ? isOpen : open;
    const Icon = isFolderOpen ? FolderOpenIcon : FolderIcon;

    return (
        <li className="flex flex-col gap-1">
            <button
                type="button"
                onClick={() => setIsOpen((value) => !value)}
                disabled={open !== undefined}
                className={cn(
                    "flex items-center gap-1 break-all text-start cursor-pointer",
                    "hover:opacity-60 transition-opacity",
                    active && "font-semibold"
                )}
            >
                <Icon height="14" className="shrink-0" />
                {name}
            </button>
            {isFolderOpen && (
                <ul className="flex flex-col gap-2 ps-4">{children}</ul>
            )}
        </li>
    );
}

export function Tree({ className, ...props }: ComponentProps<"ul">) {
    return (
        <ul
            className={cn(
                "docs-filetree mt-[1.25em] select-none text-sm text-gray-800 dark:text-gray-300",
                "not-prose",
                "rounded-lg border px-4 py-3 inline-flex flex-col gap-2",
                "docs-border",
                className
            )}
            {...props}
        />
    );
}
