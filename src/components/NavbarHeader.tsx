import Link from "next/link"
import SiteSwitcher from "./SiteSwitcher"


const NavbarLogo = () => {
    return(
        <>
            <Link href="/" title="Home" className="hover:opacity-75">
                <span className="text-xl font-extrabold hover:text-red-500">sPhil</span>
            </Link>
            <div className="md:block absolute left-1/2 transform -translate-x-1/2 md:ml-12 md:relative md:left-0 md:transform-none">
                <SiteSwitcher />
            </div>
        </>
    )
}

export default NavbarLogo;