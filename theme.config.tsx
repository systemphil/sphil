import { useRouter } from "next/router";
import { type DocsThemeConfig, useConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
    logo: <span>sPhil Nextra</span>,
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

		const defaultTitle = frontMatter.overrideTitle || section;

		return {
			description: frontMatter.description,
			defaultTitle,
			titleTemplate: `%s – ${section}`,
		}
	}
}

export default config;