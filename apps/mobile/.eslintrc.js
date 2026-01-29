/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["../../.eslintrc.js"],
  env: {
    "react-native/react-native": true,
  },
  plugins: ["react-native"],
  rules: {
    // Mobile-specific rules
    "react-native/no-unused-styles": "warn",
    "react-native/no-inline-styles": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
