import { Button } from "@mui/material";
import { signIn } from "lib/auth/authConfig";
import { cn } from "lib/utils";

export function SignInButton({
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    return (
        <form
            action={async () => {
                "use server";
                await signIn();
            }}
            className="flex grow"
        >
            <Button
                type="submit"
                className={cn("", className)}
                variant="contained"
                {...props}
            >
                Sign in
            </Button>
        </form>
    );
}
