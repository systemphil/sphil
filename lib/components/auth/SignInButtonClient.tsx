"use client";

import { signIn } from "next-auth/react";
import { cn } from "lib/utils";
import { Button, type ButtonProps } from "@mui/material";

export function SignInButtonClient({ className, ...props }: ButtonProps) {
    return (
        <Button
            variant="contained"
            size="small"
            onClick={() => signIn()}
            className={cn("", className)}
            {...props}
        >
            Sign in
        </Button>
    );
}
