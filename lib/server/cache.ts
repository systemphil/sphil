import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

const isDevelopment = process.env.NODE_ENV === "development";

export const CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS = isDevelopment
    ? 10
    : 60 * 15;
export const CACHE_REVALIDATION_INTERVAL_MAINTENANCE = isDevelopment
    ? 10
    : 60 * 60; // 1 hour

export function cache<TArgs extends readonly unknown[], TResult>(
    cb: (...args: TArgs) => Promise<TResult>,
    keyParts: string[],
    options: { revalidate?: number | false; tags?: string[] } = {}
): (...args: TArgs) => Promise<TResult> {
    return nextCache(reactCache(cb), keyParts, options) as (
        ...args: TArgs
    ) => Promise<TResult>;
}

export const cacheKeys = {
    allPublicCourses: "allPublicCourses",
    allSeminars: "allSeminars",
} as const;
