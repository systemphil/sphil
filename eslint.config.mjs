import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            // Put these rules after the recommended rules to override them
            "import/no-cycle": "warn",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-require-imports": "warn",
            "import/no-anonymous-default-export": "off",
            "prefer-const": "warn",
            "no-var": "off", // prisma.init requires var in global namespace setting
        },
    },
];

export default eslintConfig;
