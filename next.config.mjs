import nextra from "nextra";

const withNextra = nextra({
    latex: true,
    defaultShowCopyCode: true,
    contentDirBasePath: "/articles",
});

const nextConfig = withNextra({
    output: "standalone",
    reactStrictMode: true,
    // webpack(config) {
    //     // rule.exclude doesn't work starting from Next.js 15
    //     const { test: _test, ...imageLoaderOptions } = config.module.rules.find(
    //         (rule) => rule.test?.test?.(".svg")
    //     );
    //     config.module.rules.push({
    //         test: /\.svg$/,
    //         oneOf: [
    //             {
    //                 resourceQuery: /svgr/,
    //                 use: ["@svgr/webpack"],
    //             },
    //             imageLoaderOptions,
    //         ],
    //     });
    //     return config;
    // },
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
    // experimental: {
    //     turbo: {
    //         rules: {
    //             "./app/_icons/*.svg": {
    //                 loaders: ["@svgr/webpack"],
    //                 as: "*.js",
    //             },
    //         },
    //     },
    //     optimizePackageImports: [
    //         // '@app/_icons'
    //         // Provoke error
    //         // Could not find the module in the React Client Manifest. This is probably a bug in the React Server Components bundler
    //         // 'nextra/components'
    //     ],
    // },
});

export default nextConfig;
