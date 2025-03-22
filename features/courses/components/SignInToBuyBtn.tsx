"use client";

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
        <button onClick={() => signIn()} className="d-btn d-btn-primary">
            Sign In To Buy
        </button>
    );
};
