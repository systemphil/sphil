import { signOut } from "lib/auth/authConfig";
import { cn } from "lib/utils";

export function SignOutButton({
    className,
    ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <form
            action={async () => {
                "use server";
                await signOut();
            }}
        >
            <button type="submit" className={cn("", className)} {...props}>
                Sign Out
            </button>
        </form>
    );
}
