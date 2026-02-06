import eslint from '@eslint/js';
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from 'eslint-plugin-react-hooks'
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import babelParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: {
            parser: babelParser,
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            import: importPlugin,
            react: pluginReact,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
        },
        rules: {
            "no-unused-vars": "off",
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                }
            ],

            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn"
        },
    },
]);
