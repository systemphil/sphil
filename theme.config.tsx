import NavbarHeader from "@/components/NavbarHeader";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import { type DocsThemeConfig, useConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
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
      	link: 'https://github.com/shuding/nextra'
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
	search: {
		placeholder: "Search encyclopaedia…",
	  },
	footer: {
		component: Footer,
	},
}

export default config;