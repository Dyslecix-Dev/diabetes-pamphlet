import eslintConfigPrettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...astro.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    ignores: ["dist/", "node_modules/", ".astro/", ".vercel/"],
  },
  eslintConfigPrettier,
];
