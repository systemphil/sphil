import { SymposiaCard } from "../SymposiaCard";

export function TableOfContentsExtra() {
    return (
        <>
            <LinkToDiscussion />
            <SymposiaCard />
        </>
    );
}

function LinkToDiscussion() {
    return (
        <a
            // TODO fix classes, nextra no longer uses nx- prefix
            className="focus-visible:nextra-focus text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 contrast-more:text-gray-700 contrast-more:dark:text-gray-100"
            target="_blank"
            href="https://github.com/systemphil/sphil/discussions"
        >
            Share your thoughts 💬{" "}
        </a>
    );
}
