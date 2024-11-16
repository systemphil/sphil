"use client";

import { usePathname } from "next/navigation";

export type SphilSite = "hegel" | "kant" | "spinoza";

export function useSphilSite(): SphilSite | undefined {
    const pathname = usePathname();
    if (pathname.startsWith("/articles/hegel")) {
        return "hegel";
    }

    if (pathname.startsWith("/articles/kant")) {
        return "kant";
    }

    if (pathname.startsWith("/articles/spinoza")) {
        return "spinoza";
    }

    return undefined;
}
