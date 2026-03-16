// .lintstagedrc.mjs
const config = {
  "*.{ts,tsx}": ["prettier --write --ignore-unknown", "eslint --cache --fix --max-warnings=0"],
  "*.{js,jsx,mjs,cjs}": [
    "prettier --write --ignore-unknown",
    "eslint --cache --fix --max-warnings=0",
  ],
  "*.{json,jsonc,md,mdx,yml,yaml,css,scss,html}": ["prettier --write --ignore-unknown"],
};

export default config;
