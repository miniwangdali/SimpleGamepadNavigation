import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import * as tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import { importX } from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
    includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['*.mjs'],
                },
            },
        },
    },
    {
        files: ['**/*.json'],
        plugins: { json },
        ignores: ['**/package-lock.json'],
        language: 'json/jsonc',
        extends: ['json/recommended'],
    },
    { files: ['**/*.jsonc'], plugins: { json }, language: 'json/jsonc', extends: ['json/recommended'] },
    {
        files: ['**/*.md'],
        plugins: { markdown },
        language: 'markdown/gfm',
        extends: ['markdown/recommended'],
        rules: {
            'markdown/no-missing-label-refs': 'off',
        },
    },
    eslintPluginPrettierRecommended,
    importX.flatConfigs.recommended,
    importX.flatConfigs.typescript,
    {
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            'import-x/no-named-as-default-member': 'off',
            'import-x/order': [
                'error',
                {
                    groups: [['type'], ['builtin', 'external'], ['sibling', 'parent', 'index'], ['object']],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc' },
                },
            ],
            '@typescript-eslint/consistent-type-imports': 'error',
        },
    },
]);
