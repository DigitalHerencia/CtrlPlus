const lintStagedConfig = {
  "*": ["prettier --write --ignore-unknown"],
  "*.{js,jsx,ts,tsx,mjs,cjs}": ["eslint --cache --fix --max-warnings=0"],
};

export default lintStagedConfig;
