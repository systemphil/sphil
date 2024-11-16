import { cn } from "lib/utils";

export function Button({
    children,
    onClick,
    className,
}: {
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "dark:bg-dark-green-hsl dark:hover:bg-emerald-700 bg-neutral-300 hover:bg-neutral-400 duration-300 p-2 rounded-lg shadow-lg hover:drop-shadow-xl",
                className
            )}
        >
            {children}
        </button>
    );
}
