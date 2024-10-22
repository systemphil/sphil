import { Navbar } from "nextra-theme-docs";
import { useSphilSite } from "./SiteSwitcher";

type NavbarArgs = Parameters<typeof Navbar>;
type NavigationProps = {
    items: NavbarArgs[0]["items"];
};
/**
 * Navigation control for routes. Removes the initial directories when user is on root and dynamically adds back their subdirectories
 * based on what the user selects from the SiteSwitcher component.
 */
const Navigation = (props: NavigationProps) => {
    // get the first subdirectory of the url if it exists
    const site = useSphilSite();

    const leadingItem = props.items[0];

    // if user is on the first subdirectory and its routes are not listed in the navbar, proceed to add to the navbar array
    if (site && leadingItem?.name !== "guides") {
        props.items.unshift(
            {
                title: "Guides",
                name: "guides",
                route: `/${site}/guides`,
                type: "page",
            },
            {
                title: "Reference",
                name: "reference",
                route: `/${site}/reference`,
                type: "page",
            }
        );
    }

    // otherwise, remove subdirectories from the root page
    // the idea is that these appear (with their relevant routes) once a user has selected a subdirectory
    const headerItems = props.items.filter((item: { name: string }) => {
        return (
            item.name !== "hegel" &&
            item.name !== "kant" &&
            item.name !== "spinoza"
        );
    });

    // items={headerItems}
    return <Navbar {...props} items={headerItems} />;
};

export default Navigation;
