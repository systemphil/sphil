import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* cSpell:disable */

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

/**
 * Don't forget to use `await` when calling this function.
 */
export async function sleep(ms: number) {
    return await new Promise((r) => setTimeout(r, ms));
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
    return CURRENCY_FORMATTER.format(amount);
}

export function romanize(num: number) {
    if (isNaN(num)) return NaN;
    var digits = String(+num).split(""),
        key = [
            "",
            "C",
            "CC",
            "CCC",
            "CD",
            "D",
            "DC",
            "DCC",
            "DCCC",
            "CM",
            "",
            "X",
            "XX",
            "XXX",
            "XL",
            "L",
            "LX",
            "LXX",
            "LXXX",
            "XC",
            "",
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX",
        ],
        roman = "",
        i = 3;
    while (i--) {
        const digit = digits.pop() ?? "0";
        roman = (key[+digit + i * 10] || "") + roman;
    }
    return Array(+digits.join("") + 1).join("M") + roman;
}
