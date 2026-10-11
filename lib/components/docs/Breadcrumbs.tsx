import { ENCYCLOPAEDIA_ROOT } from "lib/config/navigation";
import type { TreeNode } from "lib/content/types";
import { BreadcrumbTrail, type Crumb } from "lib/components/ui/BreadcrumbTrail";

/**
 * Breadcrumb trail, rooted at the Encyclopaedia. A node whose first child is
 * the next crumb is rendered unlinked, matching Nextra's behaviour.
 */
export function Breadcrumbs({ nodes }: { nodes: TreeNode[] }) {
    const crumbs: Crumb[] = [
        {
            key: ENCYCLOPAEDIA_ROOT.route,
            title: ENCYCLOPAEDIA_ROOT.title,
            href: ENCYCLOPAEDIA_ROOT.route,
        },
        ...nodes.map((node, index) => {
            const next = nodes[index + 1];
            const href =
                !next || node.children?.[0]?.route === next.route
                    ? ""
                    : ((node.hasPage
                          ? node.route
                          : node.children?.[0]?.route) ?? "");
            return {
                key: `${node.route}-${node.name}`,
                title: node.title,
                href,
            };
        }),
    ];

    return (
        <BreadcrumbTrail
            crumbs={crumbs}
            className="docs-breadcrumb mt-1.5"
            linkClassName="docs-focus ring-inset"
        />
    );
}
