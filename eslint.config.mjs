import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';

const LEGACY_IMPORT_ALLOWLIST = [
  'app/(tenant)/operations/admin/page.tsx',
  'app/api/stripe/webhook/route.ts',
  'tests/e2e/happy-path.spec.ts',
  'tests/integration/booking.test.ts',
  'tests/integration/catalog-rsc.test.ts',
  'tests/integration/catalog.test.ts',
  'tests/integration/invoice.test.ts',
  'tests/integration/stripe-webhook.test.ts',
  'tests/integration/upload-preview.test.ts',
  'tests/unit/template-preview.test.ts'
];

const LEGACY_IMPORT_PATTERNS = [
  '**/lib/fetchers/**',
  '**/lib/actions/**',
  '@/lib/fetchers/**',
  '@/lib/actions/**',
  'lib/fetchers/**',
  'lib/actions/**'
];

const TYPE_CONTRACT_RULE = [
  'error',
  {
    selector: 'ExportNamedDeclaration > TSInterfaceDeclaration',
    message:
      'Shared/domain type contracts must live in types/**. Keep one-file UI prop types local and non-exported.'
  },
  {
    selector: 'ExportNamedDeclaration > TSTypeAliasDeclaration',
    message:
      'Shared/domain type contracts must live in types/**. Keep one-file UI prop types local and non-exported.'
  }
];

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
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: LEGACY_IMPORT_PATTERNS,
              message:
                'Legacy imports are blocked. Use lib/fetchers/** for reads and lib/actions/** for writes.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['app/**/*.ts', 'app/**/*.tsx', 'components/**/*.ts', 'components/**/*.tsx', 'features/**/components/**/*.ts', 'features/**/components/**/*.tsx'],
    rules: {
      'no-restricted-syntax': TYPE_CONTRACT_RULE
    }
  },
  {
    files: LEGACY_IMPORT_ALLOWLIST,
    rules: {
      'no-restricted-imports': 'off'
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
