// @ts-check
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export const coreConfig = [
  eslint.configs.recommended,
  prettier,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/eslint.config.mjs',
      '**/prettier.config.mjs',
    ],
  },
];

export const sharedTypeScriptRules = {
  files: ['**/*.ts', '**/*.tsx'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
  },
};

export const baseConfig = [
  ...coreConfig,
  ...tseslint.configs.recommended,
  sharedTypeScriptRules,
];

export default baseConfig;
