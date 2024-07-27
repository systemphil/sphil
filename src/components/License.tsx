"use client";

import { usePathname } from "next/navigation";
import { CreativeCommonsLogo } from "./icons/CreativeCommonsLogo";

export const License = () => {
    const path = usePathname();

    if (path.startsWith("/contributing")) {
        return null;
    }

    return (
        <div className="has-tooltip">
            <div className="flex justify-center -translate-y-20">
                <span className="tooltip rounded shadow-lg p-1 bg-gray-100  dark:bg-slate-900 text-center">
                    You&apos;re allowed to freely share, remix, adapt, and build
                    upon the work non-commercially, as long as credit is given
                    to the author(s), a link to the source is provided and new
                    creations are licensed under identical terms. Click the link
                    below to view the full license.
                </span>
            </div>
            <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en"
                target="_blank"
            >
                <div className="flex flex-col justify-center items-center gap-1">
                    <CreativeCommonsLogo />
                    <p className="text-center text-sm max-w-[400px] z-100">
                        This article is licensed under Creative Commons
                        Attribution-NonCommercial-ShareAlike 4.0 International
                        License.
                    </p>
                </div>
            </a>
        </div>
    );
};
