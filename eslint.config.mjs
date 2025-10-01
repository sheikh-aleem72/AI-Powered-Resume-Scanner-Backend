// eslint.config.mjs
import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config({
  files: ['src/**/*.{ts,tsx,js}'],
  languageOptions: {
    parser: tseslint.parser,
    globals: {
      ...globals.node,
      ...globals.browser,
    },
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    prettier: eslintPluginPrettier,
  },
  extends: [
    ...tseslint.configs.recommended,
    prettierConfig, // disables conflicts with Prettier
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'prettier/prettier': 'error', // Prettier formatting as ESLint rule
  },
});
