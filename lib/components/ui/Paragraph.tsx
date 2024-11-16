import { cn } from "lib/utils";

type ParagraphProps = {
    children: React.ReactNode;
    style?: "base" | "grotesk";
    className?: string;
};

export function Paragraph({
    children,
    style = "base",
    className,
}: ParagraphProps) {
    const baseClasses = `mx-6 z-10 text-[#666666] dark:text-[#888888]`;

    switch (style) {
        case "grotesk":
            return (
                <p
                    className={cn(
                        baseClasses,
                        "text-center text-lg sm:text-xl md:text-2xl font-space-grotesk max-h-[112px] md:max-h-[96px] w-[315px] md:w-[600px]",
                        className
                    )}
                >
                    {children}
                </p>
            );
        case "base":
            return (
                <p
                    className={cn(
                        baseClasses,
                        "text-justify text-lg md:text-xl",
                        className
                    )}
                >
                    {children}
                </p>
            );
    }
}
