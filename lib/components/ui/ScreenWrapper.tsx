import { cn } from "lib/utils";

export function ScreenWrapper({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("min-h-[calc(100vh-64px)]", className)} {...props}>
            {children}
        </div>
    );
}
