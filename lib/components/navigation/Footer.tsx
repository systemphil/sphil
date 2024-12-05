"use client";

import Link from "next/link";
import { LogoOwl } from "../LogoOwl";
import { LogoAnimated } from "../LogoAnimated";
import { SymposiaCard } from "../SymposiaCard";
import { SocialIcon } from "../icons/SocialIcon";

const footerLinkClasses =
    "text-sm text-gray-600 dark:text-gray-400 no-underline hover:text-gray-800 hover:dark:text-gray-200 transition";

export function Footer(): React.ReactElement {
    return (
        <div className="pb-12 relative">
            <div className="mx-auto max-w-[90rem] p-12 flex justify-center md:justify-center text-black dark:text-white">
                <FooterContent />
            </div>
        </div>
    );
}

function FooterLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    if (href.startsWith("http")) {
        return (
            <a
                href={href}
                className={footerLinkClasses}
                target="_blank"
                rel="noopener noreferrer"
            >
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

function FooterHeader({ children }: { children: React.ReactNode }) {
    return <h3 className="text-sm text-black dark:text-white">{children}</h3>;
}

function FooterContent() {
    const navigation = {
        general: [
            {
                name: "Discussion",
                href: "https://github.com/systemphil/sphil/discussions",
            },
            { name: "Symposia", href: "https://sphil.xyz/symposia" },
            { name: "Acknowledgements", href: "/articles/acknowledgements" },
        ],
        hegel: [
            { name: "Guides", href: "/articles/hegel/guides" },
            { name: "Reference", href: "/articles/hegel/reference" },
        ],
        kant: [
            { name: "Guides", href: "/articles/kant/guides" },
            { name: "Reference", href: "/articles/kant/reference" },
        ],
        company: [
            { name: "Team", href: "/team" },
            { name: "Contributing", href: "/articles/contributing" },
            { name: "Methodology", href: "/articles/contributing/methodology" },
            {
                name: "Code of Conduct",
                href: `/articles/contributing/code-of-conduct`,
            },
        ],
        legal: [
            { name: "Privacy Policy", href: "/articles/privacy" },
            { name: "Terms of Use", href: "/articles/terms" },
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
                                </ul>
                            </div>
                            <div className="mt-12 md:!mt-0">
                                <FooterHeader>Social</FooterHeader>
                                <div className="flex gap-3 flex-wrap mt-4">
                                    <SocialIcon
                                        icon="bluesky"
                                        href="https://bsky.app/profile/sphil.xyz"
                                    />
                                    <SocialIcon
                                        icon="facebook"
                                        href="https://www.facebook.com/profile.php?id=61564840656103"
                                    />
                                    <SocialIcon
                                        icon="youtube"
                                        href="https://www.youtube.com/@sphildotxyz"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 mt-8 sm:flex sm:items-center sm:justify-between gap-28">
                    <div>
                        <Link
                            className="text-current flex gap-4 items-center"
                            href="/"
                        >
                            <LogoOwl />
                            <LogoAnimated animation={false} />
                        </Link>
                        <p className="mt-4 text-xs text-gray-500 dark:text-[#888888]">
                            &copy; 2024 Eru Iluvatar, Ltd. All rights reserved.
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
