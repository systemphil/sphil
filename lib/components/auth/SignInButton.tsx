import { signIn } from "lib/auth/authConfig";
import { cn } from "lib/utils";

export function SignInButton({
    className,
    ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <form
            action={async () => {
                "use server";
                await signIn();
            }}
        >
            <button
                type="submit"
                className={cn(
                    "bg-blue-500 hover:bg-blue-400 transition-colors duration-300 text-white font-bold py-2 px-4 rounded",
                    className
                )}
                {...props}
            >
                Sign in
            </button>
        </form>
    );
}
