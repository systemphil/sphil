import { Callout } from "../mdx/Callout";
import { Link } from "../mdx/Link";

export const Stub = () => {
    return (
        <Callout emoji="🌱">
            This page is a stub. Help us expand it by contributing! Head on over
            to our <Link href="/articles/contributing">contributions page</Link>{" "}
            to learn more!
        </Callout>
    );
};
