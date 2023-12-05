import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,md,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,md,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,md,mdx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
      container: {
			center: true,
			padding: "2rem",
			screens: {
			"2xl": "1400px",
			},
      },
      extend: {
			// backgroundImage: {
			//   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			//   'gradient-conic':
			//     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			// },
        backgroundImage: {
			'radial-gradient': 'radial-gradient(#FFFFFF 25%, rgb(255 255 255), transparent)',
			'radial-gradient-dark': 'radial-gradient(rgb(40 40 40) 40%, rgb(175 185 159) 50%, transparent, rgb(20 20 20))',
        },
        fontFamily: {
          	serif: ['var(--font-cinzel)'],
        },
        colors: {
          	'dark-green-hsl': 'hsl(155, 100%, 66%, 0.17)',
        },
      },
    },
    darkMode: 'class',
    plugins: [],
}
export default config
