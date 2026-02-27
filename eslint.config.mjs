import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs['recommended-type-checked'].rules,
      '@typescript-eslint/no-explicit-any': 'error'
    }
  },
  eslintConfigPrettier,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.next/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.vercel/**',
      '.cache/**'
    ]
  }
];
