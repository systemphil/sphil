import { cinzel } from "lib/utils/fonts";

type HeadingProps = {
    children: React.ReactNode;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    replacementClasses?: string;
    additionalClasses?: string;
};

export function Heading({
    children,
    as = "h1",
    replacementClasses,
    additionalClasses,
}: HeadingProps) {
    const baseClasses = `${
        cinzel.className
    } font-serif z-10 font-extrabold py-1 leading-tight text-center bg-clip-text ${
        !replacementClasses &&
        "text-transparent bg-linear-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]"
    } ${additionalClasses}`;
    switch (as) {
        case "h1":
            return (
                <h1
                    className={`${baseClasses} ${replacementClasses} text-4xl md:text-5xl lg:text-6xl`}
                >
                    {children}
                </h1>
            );
        case "h2":
            return (
                <h2
                    className={`${baseClasses} ${replacementClasses} text-3xl md:text-4xl lg:text-5xl`}
                >
                    {children}
                </h2>
            );
        case "h3":
            return (
                <h3
                    className={`${baseClasses} ${replacementClasses} text-2xl md:text-3xl lg:text-4xl`}
                >
                    {children}
                </h3>
            );
        case "h4":
            return (
                <h4
                    className={`${baseClasses} ${replacementClasses} text-xl md:text-2xl lg:text-3xl`}
                >
                    {children}
                </h4>
            );
        case "h5":
            return (
                <h5
                    className={`${baseClasses} ${replacementClasses} text-lg md:text-xl lg:text-2xl`}
                >
                    {children}
                </h5>
            );
        case "h6":
            return (
                <h6
                    className={`${baseClasses} ${replacementClasses} text-md md:text-lg lg:text-xl`}
                >
                    {children}
                </h6>
            );
    }
}
