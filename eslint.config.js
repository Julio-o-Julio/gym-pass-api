import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['src/**/*.{ts,js}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          semi: true,
          singleQuote: true,
          trailingComma: 'all',
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'import/newline-after-import': ['error', { count: 1 }],
    },
  },
];
