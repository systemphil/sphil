"use client";

import { License } from "./License";

export function ArticleWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div data-label="ArticleWrapper">
            {children}
            <License />
        </div>
    );
}
