import { Callout } from "../mdx/Callout";
import { Link } from "../mdx/Link";

/**
 * Use with a link to a specific GitHub discussion thread.
 * Or pass nothing to default the link to the discussions page.
 */
export const HotTopic = ({ href }: { href?: string }) => {
    const discussionsUrl = "https://github.com/systemphil/sphil/discussions";
    return (
        <Callout emoji="🔥" type="warning">
            This section is hotly debated! Head to&nbsp;
            {href ? (
                <Link href={href}>the discussion</Link>
            ) : (
                <Link href={discussionsUrl}>the discussion</Link>
            )}{" "}
            to learn more!
        </Callout>
    );
};
