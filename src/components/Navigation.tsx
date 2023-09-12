import { Navbar } from "nextra-theme-docs";
import { PageItem, MenuItem } from 'nextra/normalize-pages';
import { useSphilSite } from "./SiteSwitcher";

type NavbarArgs = Parameters<typeof Navbar>;
type NewRouteItem = {
    route: string;
    title: string;
    type: string;
    id: string;
    key: string;
};
type NavigationProps = {
    flatDirectories: NavbarArgs[0]['flatDirectories'];
    items: (PageItem | MenuItem | NewRouteItem)[];
}
// TODO fix types. how to match the return of this function with the original navbar function above?

/**
 * Navigation control for routes. 
 */
const Navigation = (props: any) => {
    // get the first subdirectory of the url if it exists
    const site = useSphilSite();

    // run through the items currently in the navbar
    const leadingItem = props.items[0];

    // if user is on the first subdirectory and it is not listed in the navbar, proceed to add to the navbar
    if (leadingItem?.id !== "contextual-guides" && site) {
        props.items.unshift(
            {
                title: "Guides",
                type: "page",
                route: `/${site}/guides`,
                id: "contextual-guides",
                key: "contextual-guides",
            }, 
            {
                title: "Reference",
                type: "page",
                route: `/${site}/reference`,
                id: "contextual-reference",
                key: "contextual-reference",
            }
        );
    }
    
    // otherwise, remove subdirectories from the root page
    // the idea is that these appear (with their relevant routes) once a user has selected a subdirectory
    const headerItems = props.items.filter((item: { name: string; }) => {
        return item.name !== "hegel" && item.name !== "kant";
    })

    return <Navbar {...props} items={headerItems} />
}

export default Navigation;