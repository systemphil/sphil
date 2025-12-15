import { CoursesMarketingCard } from "../CoursesMarketingCard";

export function TableOfContentsExtra() {
    return (
        <>
            <LinkToDiscussion />
            <CoursesMarketingCard />
        </>
    );
}

function LinkToDiscussion() {
    return (
        <a
            className="focus-visible:nextra-focus text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 contrast-more:text-gray-700 contrast-more:dark:text-gray-100"
            target="_blank"
            href="https://github.com/systemphil/sphil/discussions"
            rel="noreferrer noopener"
        >
            Share your thoughts 💬{" "}
        </a>
    );
}
