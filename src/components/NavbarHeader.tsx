import Link from "next/link"
import SiteSwitcher from "./SiteSwitcher"
import LogoAnimated from "./LogoAnimated";


const NavbarHeader = () => {
    return(
        <>
            <h2 id="navbar-heading" className="sr-only">Navbar heading</h2>
            <Link href="/" title="Home" className="">
                <LogoAnimated />
            </Link>
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 lg:ml-12 md:relative md:left-0 md:transform-none">
                <SiteSwitcher />
            </div>
        </>
    );
}

export default NavbarHeader;