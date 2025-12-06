export default {
  semi: true,
  tabWidth: 2,
  printWidth: 120,
  singleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'cn', 'cva'],
  tailwindStylesheet: './apps/web/src/app/globals.css',
};
