import nextra from "nextra";

const withNextra = nextra({
    latex: true,
    defaultShowCopyCode: true,
    contentDirBasePath: "/articles",
});

const nextConfig = withNextra({
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
    async redirects() {
        return [
            {
                source: "/symposia/courses/:slug*",
                destination: "/courses/:slug*",
                permanent: true,
            },
        ];
    },
    typescript: {
        ignoreBuildErrors: true, // Separate step
    },
});

export default nextConfig;
