import { cn } from "lib/utils";

export function CardShell({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "card rounded-sm shadow-xl border bg-linear-to-b from-white to-neutral-100/90 transition duration-300 dark:from-neutral-950/90 dark:to-neutral-800/90  md:bg-linear-to-bl",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
