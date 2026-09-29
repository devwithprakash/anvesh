// @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  bracketSpacing: true,
  trailingComma: 'all',
  arrowParens: 'avoid',

  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;