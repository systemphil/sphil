import Link from "next/link";
import { ReactNode, ReactElement } from "react";
import cn from "classnames";
import { ThemeSwitch } from "nextra-theme-docs";
import LogoAnimated from "./LogoAnimated";
import LogoOwl from "./LogoOwl";
import { clearCookies } from "@/util/clearCookies";
import Button from "@/components/Button";
import { SymposiaCard } from "./SymposiaCard";

const footerLinkClasses =
    "text-sm text-gray-600 dark:text-gray-400 no-underline hover:text-gray-800 hover:dark:text-gray-200 transition";

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
    if (href.startsWith("http")) {
        return (
            <a href={href} className={footerLinkClasses} target="_blank">
                {children}
            </a>
        );
    }
    return (
        <Link href={href} className={footerLinkClasses}>
            {children}
        </Link>
    );
}

function FooterHeader({ children }: { children: ReactNode }) {
    return <h3 className="text-sm text-black dark:text-white">{children}</h3>;
}

const navigation = {
    general: [
        {
            name: "Discussion",
            href: "https://github.com/systemphil/sphil/discussions",
        },
        { name: "Symposia", href: "https://symposia.sphil.xyz" },
        { name: "Acknowledgements", href: "/acknowledgements" },
    ],
    hegel: [
        { name: "Guides", href: "/hegel/guides" },
        { name: "Reference", href: "/hegel/reference" },
    ],
    kant: [
        { name: "Guides", href: "/kant/guides" },
        { name: "Reference", href: "/kant/reference" },
    ],
    company: [
        { name: "Team", href: "/team" },
        { name: "Contributing", href: "/contributing" },
        { name: "Methodology", href: "/contributing/methodology" },
        { name: "Code of Conduct", href: `/contributing/code-of-conduct` },
    ],
    legal: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Use", href: "/terms" },
    ],
    support: [
        { name: "GitHub", href: "https://github.com/systemphil/" },
        { name: "YouTube", href: "https://www.youtube.com/@systemphil" },
        { name: "Twitter", href: "https://twitter.com/sphildotxyz" },
        {
            name: "Facebook",
            href: "https://www.facebook.com/profile.php?id=61564840656103",
        },
    ],
};

function FooterContent() {
    const handleClearCookies = () => {
        clearCookies();
        const dialog = document.getElementById(
            "cookie-dialog"
        ) as HTMLDialogElement;
        if (dialog) {
            dialog.show();
        }
    };

    const handleCloseDialog = () => {
        const dialog = document.getElementById(
            "cookie-dialog"
        ) as HTMLDialogElement;
        if (dialog) {
            dialog.close();
        }
    };

    return (
        <div className="w-full" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="w-full py-8 mx-auto">
                <div className="">
                    <div className="grid grid-cols-1 gap-8 xl:col-span-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 md:gap-8">
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>Resources</FooterHeader>
                                <ul
                                    role="list"
                                    className="mt-4 space-y-1.5 list-none ml-0"
                                >
                                    {navigation.general.map((item) => (
                                        <li key={item.name}>
                                            <FooterLink href={item.href}>
                                                {item.name}
                                            </FooterLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>Hegel</FooterHeader>
                                <ul
                                    role="list"
                                    className="mt-4 space-y-1.5 list-none ml-0"
                                >
                                    {navigation.hegel.map((item) => (
                                        <li key={item.name}>
                                            <FooterLink href={item.href}>
                                                {item.name}
                                            </FooterLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>Kant</FooterHeader>
                                <ul
                                    role="list"
                                    className="mt-4 space-y-1.5 list-none ml-0"
                                >
                                    {navigation.kant.map((item) => (
                                        <li key={item.name}>
                                            <FooterLink href={item.href}>
                                                {item.name}
                                            </FooterLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>About</FooterHeader>
                                <ul
                                    role="list"
                                    className="mt-4 space-y-1.5 list-none ml-0"
                                >
                                    {navigation.company.map((item) => (
                                        <li key={item.name}>
                                            <FooterLink href={item.href}>
                                                {item.name}
                                            </FooterLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>Legal</FooterHeader>
                                <ul
                                    role="list"
                                    className="mt-4 space-y-1.5 list-none ml-0"
                                >
                                    {navigation.legal.map((item) => (
                                        <li key={item.name}>
                                            <FooterLink href={item.href}>
                                                {item.name}
                                            </FooterLink>
                                        </li>
                                    ))}
                                    <li
                                        key="cookie-removal"
                                        onClick={() => handleClearCookies()}
                                    >
                                        <button className={footerLinkClasses}>
                                            Delete Cookies
                                        </button>
                                    </li>

                                    <dialog id="cookie-dialog">
                                        <div className="flex flex-col items-center justify-center max-w-md shadow p-4 rounded-md">
                                            <span className="p-2">
                                                All cookies should now be
                                                deleted and you will be asked
                                                upon next visit to accept or
                                                decline cookies.
                                            </span>
                                            <Button
                                                onClick={() =>
                                                    handleCloseDialog()
                                                }
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </dialog>
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>Support</FooterHeader>
                                <ul
                                    role="list"
                                    className="mt-4 space-y-1.5 list-none ml-0"
                                >
                                    {navigation.support.map((item) => (
                                        <li key={item.name}>
                                            <FooterLink href={item.href}>
                                                {item.name}
                                            </FooterLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 mt-8 sm:flex sm:items-center sm:justify-between gap-28">
                    <div>
                        <Link
                            className="text-current flex gap-4 items-center"
                            target="_blank"
                            href="/"
                        >
                            <LogoOwl />
                            <LogoAnimated animation={false} />
                        </Link>
                        <p className="mt-4 text-xs text-gray-500 dark:text-[#888888]">
                            &copy; {new Date().getFullYear()} Eru Iluvatar, Ltd.
                            All rights reserved.
                        </p>
                    </div>

                    <div className="visible xl:hidden">
                        <SymposiaCard />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Footer({ menu }: { menu?: boolean }): ReactElement {
    return (
        <footer className="pb-12 relative">
            <div className="absolute top-0 h-36 w-full -translate-y-full bg-gradient-to-t from-[#fff6f6] to-transparent dark:from-[#10b981] pointer-events-none opacity-10" />
            {/* Because nextra displays ThemeSwitch button on the docs, we disable it from here whenever the user is not on doc pages*/}
            <div
                className={cn(
                    "mx-auto max-w-[90rem] py-2 px-4 flex gap-2",
                    menu ? "flex" : "hidden"
                )}
            >
                <ThemeSwitch />
            </div>
            <hr className="dark:border-neutral-800" />
            <div className="mx-auto max-w-[90rem] p-12 flex justify-center md:justify-center text-black dark:text-white">
                <FooterContent />
            </div>
        </footer>
    );
}
