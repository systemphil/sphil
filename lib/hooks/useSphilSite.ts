"use client";

import { usePathname } from "next/navigation";

export type SphilSite = "hegel" | "kant" | "spinoza";

export function useSphilSite(): SphilSite | undefined {
    const pathname = usePathname();
    if (pathname.startsWith("/docs/hegel")) {
        return "hegel";
    }

    if (pathname.startsWith("/docs/kant")) {
        return "kant";
    }

    if (pathname.startsWith("/docs/spinoza")) {
        return "spinoza";
    }

    return undefined;
}
