"use client";

import { Button } from "@mui/material";
import { cn } from "lib/utils";
import { signOut } from "next-auth/react";
import type { ButtonProps } from "@mui/material";

export function SignOutButtonClient({ className, ...props }: ButtonProps) {
    return (
        <Button
            type="submit"
            onClick={() => signOut()}
            className={cn("", className)}
            variant="contained"
            {...props}
        >
            Sign Out
        </Button>
    );
}
