import { Card, CardContent } from "@mui/material";
import { cn } from "lib/utils";

export function CardShell({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Card
            className={cn(
                "md:!bg-linear-to-bl !bg-linear-to-b",
                " dark:!from-neutral-950/90 dark:!to-neutral-800/90 dark:!border-stone-300 dark:!border-1",
                " !from-white !to-neutral-100/90",
                className
            )}
            {...props}
        >
            <CardContent>{children}</CardContent>
        </Card>
    );
}
