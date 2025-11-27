import NextLink from "next/link";
import type React from "react";

/**
 * We use this component as a default `component` prop for links and button links in our theme.
 * This ensures that all links are utilizing the NextLink component, which is required for NextJS routing to function properly.
 */
export const MuiLinkOverride = (
    props: React.ComponentProps<typeof NextLink> & {
        ref?: React.Ref<HTMLAnchorElement>;
    }
) => {
    const { ref, ...rest } = props;
    return <NextLink ref={ref} {...rest} />;
};

MuiLinkOverride.displayName = "Link";
