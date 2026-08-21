/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                port: "",
                pathname: `/sphil-dev-images/**`,
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                port: "",
                pathname: `/sphil-prod-images/**`,
            },
        ],
    },
    cacheComponents: true,
    // The article pipeline reads content/ at runtime whenever a cached
    // compilation expires, so it must ship with the standalone output.
    outputFileTracingIncludes: {
        // The root layout builds the mobile nav tree from content/, and the
        // article pipeline re-reads it whenever a cached compilation expires,
        // so it must ship with the standalone output.
        "/**": ["./content/**/*"],
    },
    async redirects() {
        return [
            {
                source: "/symposia/courses/:slug*",
                destination: "/courses/:slug*",
                permanent: true,
            },
            {
                // The Nextra authoring guide became a guide to our own
                // component set when the framework was replaced.
                source: "/articles/contributing/formatting/nextra",
                destination: "/articles/contributing/formatting/components",
                permanent: true,
            },
            {
                // The Encyclopaedia landing moved from content/articles/index.mdx
                // to content/index.mdx, dropping the doubled path segment.
                source: "/articles/articles",
                destination: "/articles",
                permanent: true,
            },
        ];
    },
    typescript: {
        ignoreBuildErrors: true, // Separate step
    },
};

export default nextConfig;
