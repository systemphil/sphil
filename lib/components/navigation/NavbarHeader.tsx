import Link from "next/link";
import { LogoOwl } from "../LogoOwl";
import { LogoAnimated } from "../LogoAnimated";
import { TITLE } from "lib/config/consts";

export function NavbarHeader() {
    return (
        <>
            <h2 id="navbar-heading" className="sr-only">
                Navbar heading
            </h2>
            <Link href="/" title={TITLE} className="flex items-center gap-4">
                <LogoOwl />
                <div className="hidden min-[350px]:flex">
                    <LogoAnimated />
                </div>
            </Link>
            {/* <div className="hidden xl:flex absolute left-1/2 transform -translate-x-1/2 lg:ml-32 md:relative md:left-0 md:transform-none">
                <SiteSwitcher />
            </div> */}
        </>
    );
}
