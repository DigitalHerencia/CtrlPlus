const config = {
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "security", "refactor", "test", "docs", "chore"]],
    "scope-enum": [
      2,
      "always",
      [
        "admin",
        "auth",
        "billing",
        "catalog",
        "ci",
        "docs",
        "platform",
        "scheduling",
        "settings",
        "visualizer",
      ],
    ],
    "scope-empty": [2, "never"],
    "subject-case": [0],
  },
};

export default config;
