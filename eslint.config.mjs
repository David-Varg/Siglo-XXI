import parserAstro from "astro-eslint-parser";
import pluginAstro from "eslint-plugin-astro";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  ...pluginAstro.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: parserAstro,
    },
  },
];
