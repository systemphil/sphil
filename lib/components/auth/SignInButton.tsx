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
            className="flex grow"
        >
            <button type="submit" className={cn("", className)} {...props}>
                Sign in
            </button>
        </form>
    );
}
