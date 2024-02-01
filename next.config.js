/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
  	reactStrictMode: true,
	images: {
		unoptimized: true
	},
	distDir: "build",
}

const withNextra = require("nextra")({
	theme: "nextra-theme-docs",
	themeConfig: "./theme.config.tsx",
	// options
	// flexsearch: true,
	// staticImage: true,
	// defaultShowCopyCode: true,
});

module.exports = withNextra(nextConfig);
