import { signIn, useSession } from "next-auth/react";

export const SignInToBuyBtn = () => {
    const { status } = useSession();

    if (status === "authenticated") {
        return <span>Already logged in</span>;
    }
    if (status === "loading") {
        return <span className="loading loading-bars loading-xs"></span>;
    }

    return (
        <button onClick={() => signIn()} className="btn btn-primary">
            Sign In To Buy
        </button>
    );
};
