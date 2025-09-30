"use client";

import Link from "next/link";
import { CardShellMagic } from "./CardShellMagic";
import { Heading } from "./Heading";
import { Button } from "@mui/material";

type Buttons = {
    title: string;
    href: string;
};

export function CardFancy({
    title,
    tagline,
    href,
    buttons,
}: {
    title: string;
    tagline: string;
    href: string;
    buttons: Buttons[];
}) {
    return (
        <CardShellMagic>
            <Link href={href}>
                <div className="flex flex-col justify-center items-center">
                    <Heading
                        as="h3"
                        additionalClasses="hover:text-slate-500 duration-300"
                    >
                        {title}
                    </Heading>
                    <p className="max-w-[300px] text-center mt-2 text-lg text-stone-500">
                        {tagline}
                    </p>
                </div>
            </Link>
            <div className="flex gap-4 mt-2">
                {buttons.map((button) => {
                    return (
                        <Link key={button.href} href={button.href}>
                            <Button variant="contained">{button.title}</Button>
                        </Link>
                    );
                })}
            </div>
        </CardShellMagic>
    );
}
