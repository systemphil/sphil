import { useRouter } from "next/router";
import Link from "next/link";
import { useState, ReactNode, ReactElement } from "react";
import cn from "classnames";
import { ThemeSwitch } from "nextra-theme-docs";
import LogoAnimated from "./LogoAnimated";

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
    const classes = "text-sm text-[#666666] dark:text-[#888888] no-underline betterhover:hover:text-gray-700 betterhover:hover:dark:text-white transition";
    if (href.startsWith("http")) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }
    return (
        <Link href={href} className={classes}>
            {children}
        </Link>
    );
}

function FooterHeader({ children }: { children: ReactNode }) {
    return <h3 className="text-sm text-black dark:text-white">{children}</h3>;
}

const navigation = {
    general: [
        { name: "Blog", href: "/blog" },
        { name: "Releases", href: "https://github.com" },
    ],
    hegel: [
        { name: "Guides", href: "/hegel/guides" },
        { name: "Reference", href: "/hegel/reference" },
        { name: "FAQ", href: "/hegel" },
    ],
    kant: [
        { name: "Guides", href: "/kant/guides" },
        { name: "Reference", href: "/kant/reference" },
    ],
    support: [
        {
            name: "GitHub",
            href: "https://github.com/",
        },
        {
            name: "Discord",
            href: "https://discord.com",
        },
    ],
    company: [
        { name: "sPhil", href: "/" },
        {
            name: "Open Source Philosophy",
            href: "/",
        },
        {
            name: "Contact",
            href: `/`,
        },
        { name: "Twitter", href: "https://twitter.com" },
    ],
    legal: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
    ],
};

function FooterContent() {
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
                                <ul role="list" className="mt-4 space-y-1.5 list-none ml-0">
                                {navigation.general.map((item) => (
                                    <li key={item.name}>
                                        <FooterLink href={item.href}>{item.name}</FooterLink>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>Hegel</FooterHeader>
                                <ul role="list" className="mt-4 space-y-1.5 list-none ml-0">
                                {navigation.hegel.map((item) => (
                                    <li key={item.name}>
                                    <FooterLink href={item.href}>{item.name}</FooterLink>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>Kant</FooterHeader>
                                <ul role="list" className="mt-4 space-y-1.5 list-none ml-0">
                                {navigation.kant.map((item) => (
                                    <li key={item.name}>
                                    <FooterLink href={item.href}>{item.name}</FooterLink>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>About</FooterHeader>
                                <ul role="list" className="mt-4 space-y-1.5 list-none ml-0">
                                {navigation.company.map((item) => (
                                    <li key={item.name}>
                                        <FooterLink href={item.href}>{item.name}</FooterLink>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>Legal</FooterHeader>
                                <ul role="list" className="mt-4 space-y-1.5 list-none ml-0">
                                {navigation.legal.map((item) => (
                                    <li key={item.name}>
                                        <FooterLink href={item.href}>{item.name}</FooterLink>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>Support</FooterHeader>
                                <ul role="list" className="mt-4 space-y-1.5 list-none ml-0">
                                {navigation.support.map((item) => (
                                    <li key={item.name}>
                                        <FooterLink href={item.href}>{item.name}</FooterLink>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 mt-8 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <a
                            className="text-current"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="homepage"
                            href="/"
                        >
                            <LogoAnimated animation={false} />
                        </a>
                        <p className="mt-4 text-xs text-gray-500 dark:text-[#888888]">
                        &copy; {new Date().getFullYear()} Eru, Ltd. All rights reserved.
                        </p>
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