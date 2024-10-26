import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

export const CACHE_REVALIDATION_INTERVAL = 60; // 60 * 60 * 24 * 1; // 1 day
export const CACHE_REVALIDATION_INTERVAL_MAINTENANCE =
    process.env.NODE_ENV === "development" ? 10 : 60 * 60; // 1 hour

type Callback = (...args: any[]) => Promise<any>;
export function cache<T extends Callback>(
    cb: T,
    keyParts: string[],
    options: { revalidate?: number | false; tags?: string[] } = {}
) {
    return nextCache(reactCache(cb), keyParts, options);
}
