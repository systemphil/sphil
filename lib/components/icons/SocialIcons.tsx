import { cn } from "lib/utils";

const LIGHT_COLOR = "fill-gray-400 hover:fill-gray-500";
const DARK_COLOR = "dark:fill-emerald-700 dark:hover:fill-emerald-600";

const Bluesky = ({
    size = "base",
    href = undefined,
}: {
    size?: "base" | "large";
    href?: string;
}) => {
    const height = size === "large" ? "h-20" : "h-8";
    const width = size === "large" ? "w-20" : "w-8";

    const renderSvg = () => {
        return (
            <svg
                className={cn(
                    `${LIGHT_COLOR} ${DARK_COLOR}`,
                    `${height} ${width}`
                )}
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title>Bluesky</title>
                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
            </svg>
        );
    };

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {renderSvg()}
            </a>
        );
    }

    return renderSvg();
};

const Facebook = ({
    size = "base",
    href = undefined,
}: {
    size?: "base" | "large";
    href?: string;
}) => {
    const height = size === "large" ? "h-20" : "h-8";
    const width = size === "large" ? "w-20" : "w-8";

    const renderSvg = () => {
        return (
            <svg
                className={cn(
                    `${LIGHT_COLOR} ${DARK_COLOR}`,
                    `${height} ${width}`
                )}
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title>Facebook</title>
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
            </svg>
        );
    };

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {renderSvg()}
            </a>
        );
    }

    return renderSvg();
};

export const SocialIcons = {
    Bluesky,
    Facebook,
};
