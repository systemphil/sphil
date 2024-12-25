import { Callout } from "nextra/components";
import { Link } from "nextra-theme-docs";

export const Stub = () => {
    return (
        <Callout emoji="🌱">
            This page is a stub. Help us expand it by contributing! Head on over
            to our <Link href="/contributing">contributions page</Link> to learn
            more!
        </Callout>
    );
};
