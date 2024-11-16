import { cn } from "lib/utils";

export function PageWrapper({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <main
            className={cn(
                "h-full min-h-screen flex flex-col justify-front items-center container",
                className
            )}
            {...props}
        >
            {children}
        </main>
    );
}
