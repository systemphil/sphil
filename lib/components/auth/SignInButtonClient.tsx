"use client";

import { signIn } from "next-auth/react";
import { cn } from "lib/utils";

export function SignInButtonClient({
    className,
    ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="submit"
            onClick={() => signIn()}
            className={cn("", className)}
            {...props}
        >
            Sign in
        </button>
    );
}
