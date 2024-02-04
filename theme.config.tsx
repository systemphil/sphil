import NavbarHeader from "@/components/NavbarHeader";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import { type DocsThemeConfig, useConfig } from "nextra-theme-docs";

const SITE_ROOT = process.env.NEXT_PUBLIC_SITE_ROOT;

const config: DocsThemeConfig = {
	docsRepositoryBase: "https://github.com/systemphil/sphil/tree/dev", // root for every edit link
	editLink: {
		text: "Edit this page on GitHub",
	},
	footer: {
		component: Footer,
	},
	head: function Head() {
		const router = useRouter();
		const { frontMatter } = useConfig();
		const systemTheme = "light";
		const fullUrl =
		  	router.asPath === "/" ? SITE_ROOT : `${SITE_ROOT}${router.asPath}`;
	
		return (
			<>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href={`/images/favicon-${systemTheme}/apple-touch-icon.png`}
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href={`/images/favicon-${systemTheme}/favicon-32x32.png`}
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href={`/images/favicon-${systemTheme}/favicon-16x16.png`}
				/>
				<link
					rel="mask-icon"
					href={`/images/favicon-${systemTheme}/safari-pinned-tab.svg`}
					color="#FFFFFF"
				/>
				<link
					rel="shortcut icon"
					href={`/images/favicon-${systemTheme}/favicon.ico`}
				/>
				<meta name="msapplication-TileColor" content="#FFFFFF" />
				<meta name="theme-color" content="#FFF" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={fullUrl} />
				<link rel="canonical" href={fullUrl} />
				<meta name="image" property="og:image" content={`${SITE_ROOT}/og-image.png`} />
				<meta property="og:locale" content="en_IE" />
				<meta property="og:site_name" content="sPhil" />
				<meta
					name="description"
					property="og:description"
					content={frontMatter.description || 'Where Philosophy Meets Open Collaboration'}
				/>
				<meta 
					name="title" 
					property="og:title" 
					content={frontMatter.overrideTitle || frontMatter.title || "sPhil"}
				/>
			</>
		);
	},
    logo: NavbarHeader,
	logoLink: false,
	navbar: {
		component: Navigation,
	},
	primaryHue: {
		dark: 155,
		light: 215
	},
    project: {
      	link: "https://github.com/systemphil/sphil" // linked icon in the navbar top-right
    },
	search: {
		placeholder: "Search encyclopaedia…",
	},
	toc: {
		backToTop: true,
		// extraContent: extraContentHere,
	},
    useNextSeoProps: function SEO() {
		const router = useRouter();
		const { frontMatter } = useConfig();

		let section = "sPhil";
		if (router?.pathname.startsWith("/hegel")) {
			section = "Hegel";
		}
		if (router?.pathname.startsWith("/kant")) {
			section = "Kant";
		}
		if (router?.pathname.startsWith("/spinoza")) {
			section = "Spinoza";
		}

		const defaultTitle = frontMatter.overrideTitle || section;

		return {
			description: frontMatter.description,
			defaultTitle,
			titleTemplate: `%s – ${section}`,
		}
	},
}

export default config;
