import globals from 'globals';
import tseslint from 'typescript-eslint';

import { coreConfig, sharedTypeScriptRules } from '../../eslint.config.mjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...coreConfig,
  ...tseslint.configs.recommendedTypeChecked,
  sharedTypeScriptRules,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
];
