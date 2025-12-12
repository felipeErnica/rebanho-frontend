import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from 'eslint-plugin-react-hooks'
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import babelParser from '@typescript-eslint/parser'

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: {
            parser: babelParser,
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            react: pluginReact,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
            "@typescript-eslint": tseslint,
        },
        rules: {
            "no-unused-vars": [ "warn", { argsIgnorePattern: "^_" } ],
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-explicit-any": "off",

            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn"
        },
    },
]);
