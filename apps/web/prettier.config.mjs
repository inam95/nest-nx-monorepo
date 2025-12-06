import baseConfig from '../../prettier.config.mjs';

export default {
  ...baseConfig,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'cn', 'cva'],
  tailwindStylesheet: './src/app/globals.css',
};