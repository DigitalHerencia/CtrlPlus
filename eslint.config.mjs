import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    ignores: [
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "**/__tests__/**/*.{ts,tsx}",
      "e2e/**/*.{ts,tsx}",
      "next.config.ts",
      "playwright.config.ts",
      "prisma.config.ts",
      "tailwind.config.ts",
      "vitest.config.ts",
      "proxy.ts",
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    extends: [tseslint.configs.recommendedTypeCheckedOnly],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off",
    },
  },

  {
    files: ["app/**/*.{js,jsx,ts,tsx}"],
    ignores: ["app/api/clerk/**/*", "app/api/stripe/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/prisma",
              message:
                "Do not import Prisma in app/**. Use lib/{domain}/fetchers for reads or lib/{domain}/actions for writes.",
            },
            {
              name: "@prisma/client",
              message:
                "Do not import Prisma in app/**. Resolve data access through lib/{domain}/fetchers or lib/{domain}/actions.",
            },
            {
              name: "@prisma/adapter-neon",
              message: "Database adapters must stay out of app/**.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },

  {
    files: [
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "**/__tests__/**/*.{ts,tsx}",
      "e2e/**/*.{ts,tsx}",
      "next.config.ts",
      "playwright.config.ts",
      "prisma.config.ts",
      "tailwind.config.ts",
      "vitest.config.ts",
      "proxy.ts",
    ],
    extends: [tseslint.configs.disableTypeChecked],
  },

  {
    files: ["e2e/**/*.{ts,tsx}"],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/rules-of-hooks": "off",
    },
  },

  prettier,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "dist/**",
    "node_modules/**",
    ".turbo/**",
    ".vercel/**",
    "public/**/*.min.*",
    "**/*.generated.*",
    "**/generated/**",
    "**/__snapshots__/**",
  ]),
]);
