import js from "@eslint/js"
import ts from "typescript-eslint"
import astroPlugin from "eslint-plugin-astro"
import jsxA11y from "eslint-plugin-jsx-a11y"
import globals from "globals"

export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...astroPlugin.configs.recommended,
	{
		plugins: {
			"jsx-a11y": jsxA11y,
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			curly: ["error", "multi"],
		},
	},
	{
		ignores: ["dist/**", ".astro/**", "node_modules/**"],
	},
]
