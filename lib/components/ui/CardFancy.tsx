"use client";

import Link from "next/link";
import { Button } from "./Button";
import { CardShellMagic } from "./CardShellMagic";

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
                    <p className="text-5xl font-bold text-center hover:text-slate-600 duration-300">
                        {title}
                    </p>
                    <p className="max-w-[300px] text-center mt-2 text-lg text-stone-500">
                        {tagline}
                    </p>
                </div>
            </Link>
            <div className="flex gap-4 mt-2">
                {buttons.map((button, index) => {
                    return (
                        <Link key={index} href={button.href}>
                            <Button>{button.title}</Button>
                        </Link>
                    );
                })}
            </div>
        </CardShellMagic>
    );
}
