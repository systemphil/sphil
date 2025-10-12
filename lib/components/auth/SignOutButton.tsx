import { Button } from "@mui/material";
import { signOut } from "lib/auth/authConfig";
import { cn } from "lib/utils";

export function SignOutButton({
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    return (
        <form
            action={async () => {
                "use server";
                await signOut();
            }}
        >
            <Button
                type="submit"
                className={cn("", className)}
                variant="contained"
                {...props}
            >
                Sign Out
            </Button>
        </form>
    );
}
