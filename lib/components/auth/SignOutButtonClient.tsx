"use client";

import { cn } from "lib/utils";
import { signOut } from "next-auth/react";

export function SignOutButtonClient({
    className,
    ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="submit"
            onClick={() => signOut()}
            className={cn("", className)}
            {...props}
        >
            Sign Out
        </button>
    );
}
