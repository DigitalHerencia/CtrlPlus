const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "security", "refactor", "test", "docs", "chore"]],
    "scope-enum": [
      2,
      "always",
      ["admin", "auth", "billing", "catalog", "ci", "docs", "scheduling", "tenancy", "visualizer"],
    ],
    "scope-empty": [2, "never"],
    "subject-case": [0],
  },
};

export default config;
