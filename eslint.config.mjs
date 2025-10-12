import { dirname } from "path";
import eslintJs from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    eslintJs.configs.recommended,
    eslintReact.configs.recommended,
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    {
        rules: {
            // These rules will be added or override existing ones
            "import/no-cycle": "warn",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-require-imports": "warn",
            "import/no-anonymous-default-export": "off",
            "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect":
                "off",
            "prefer-const": "warn",
            "no-var": "off", // Explicitly turn off a core ESLint rule
        },
    },
];

export default eslintConfig;
