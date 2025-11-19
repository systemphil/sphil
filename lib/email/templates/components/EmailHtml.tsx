import * as React from "react";
import { cn } from "lib/utils";

export function EmailP({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("text-gray-500 dark:text-gray-400 my-4", className)}
            {...props}
        />
    );
}

export function EmailUl({
    className,
    ...props
}: React.HTMLAttributes<HTMLUListElement>) {
    return (
        <ul
            className={cn("text-gray-500 dark:text-gray-400 my-4", className)}
            {...props}
        />
    );
}

<a
    href="https://sphil.xyz/courses/science-of-logic-the-quality-of-being-part-1"
    target="_blank"
    rel="noreferrer noopener"
    className="text-blue-400 underline"
>
    Enroll now
</a>;

export function EmailA({
    className,
    ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <a
            target="_blank"
            rel="noreferrer noopener"
            className={cn("text-blue-400 underline", className)}
            {...props}
        />
    );
}

export function EmailH1({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            className={cn(
                "text-2xl font-bold text-gray-900 dark:text-gray-300",
                className
            )}
            style={{ textAlign: "center" }}
            {...props}
        />
    );
}
