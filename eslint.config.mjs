import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { react: pluginReact },
    settings: { react: { version: 'detect' } },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='React'][property.name=/^use[A-Z]/]",
          message:
            'Import React hooks by name (e.g. import { useState }) instead of calling them via the React.* namespace.',
        },
      ],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary', 'coerce'] }],
    },
  },
];
