/** @type {import('next').NextConfig} */

import nextra from "nextra";

const nextConfig = {
    output: "export",
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    distDir: "build",
};

const withNextra = nextra({
    theme: "nextra-theme-docs",
    themeConfig: "./theme.config.tsx",
    // options
    // flexsearch: true,
    // staticImage: true,
    // defaultShowCopyCode: true,
});

export default withNextra(nextConfig);
