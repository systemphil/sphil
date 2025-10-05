"use client";

import { Button } from "@mui/material";
import { signIn, useSession } from "next-auth/react";

export const SignInToBuyBtn = () => {
    const { status } = useSession();

    if (status === "authenticated") {
        return <span>Already logged in</span>;
    }
    if (status === "loading") {
        return <span className="d-loading d-loading-bars d-loading-xs"></span>;
    }

    return (
        <Button onClick={() => signIn()} variant="contained">
            Sign In To Buy
        </Button>
    );
};
