import globals from "globals";

export default [
  // Backend (Node.js)
  {
    files: ["**/*.js"],
    ignores: ["public/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-undef": "error"
    }
  },

  // Frontend (Browser)
  {
    files: ["public/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "no-undef": "error"
    }
  }
];
