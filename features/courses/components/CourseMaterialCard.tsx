"use client";

import Link from "next/link";
import { Heading } from "lib/components/ui/Heading";
import { ModelName } from "lib/server/ctrl";

type CourseMaterialCardProps = {
    href: string;
    heading: string;
    id: string;
    modelName: ModelName;
};
/**
 * A click-able card that displays a heading and links to provided href.
 */
export const CourseMaterialCard = ({
    href,
    heading,
    id,
    modelName,
}: CourseMaterialCardProps) => {
    console.log("CourseMaterialCard", { href, heading, id, modelName });
    return (
        <div className="flex border border-gray-200 rounded-lg mb-6 hover:bg-slate-200 duration-300 justify-between items-center">
            <Link className="flex grow" href={href}>
                <div className="flex p-2">
                    <Heading as="h6">{heading}</Heading>
                </div>
            </Link>
            <button
                className="btn btn-square mr-2 hover:bg-red-500"
                onClick={() => alert("not implemented")}
            >
                <ButtonDeleteCross />
            </button>
        </div>
    );
};

const ButtonDeleteCross = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );
};
