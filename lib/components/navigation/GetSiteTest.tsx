"use client";

// TODO cleanup
import { useConfig } from "nextra-theme-docs";
export const GetSiteTest = () => {
    const { normalizePagesResult } = useConfig();

    console.log(normalizePagesResult);
    return (
        <div>
            <h1>GetSiteTest</h1>
        </div>
    );
};
