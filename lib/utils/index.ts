import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Utility function to remove properties from an object by field
 * @param obj Object to modify
 * @param keys[] An array of properties to omit by key
 * @returns New object with the omitted properties
 */
export function exclude<Obj, Key extends keyof Obj>(
    obj: Obj,
    keys: Key[]
): Omit<Obj, Key> {
    const newObj = { ...obj };
    keys.forEach((key) => delete newObj[key]);
    return newObj;
}
