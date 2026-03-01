import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  { ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', 'bun.lock', 'yarn.lock'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Type-aware linting for TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  ...eslintPluginAstro.configs.recommended,
  eslintConfigPrettier,
];
