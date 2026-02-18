import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = [
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;

