module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-continue': 'off',
    'import/extensions': 'off',
    'no-restricted-exports': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'no-console': 'error',
  },
};
