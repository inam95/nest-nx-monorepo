import tseslint from 'typescript-eslint';

import { coreConfig, sharedTypeScriptRules } from '../../eslint.config.mjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...coreConfig,
  ...tseslint.configs.recommendedTypeChecked,
  sharedTypeScriptRules,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
