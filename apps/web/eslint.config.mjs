import { globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

import { coreConfig, sharedTypeScriptRules } from "../../eslint.config.mjs";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...coreConfig,
  ...nextCoreWebVitals,
  ...nextTypescript,
  sharedTypeScriptRules,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.config.mjs", "*.config.js"]
        },
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off"
    }
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"])
];
