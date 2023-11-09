module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true
  },

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
      '@typescript-eslint/no-shadow': 0,
      'no-underscore-dangle': 0,
      'max-classes-per-file': 0,
      'class-methods-use-this': 0,
      'no-param-reassign': 0,
      'import/extensions': 0,
      'import/no-extraneous-dependencies': 0,
      'import/prefer-default-export': 0,
      'import/no-cycle': 2,
      endOfLine: 'off',
      'import/order': [
        2,
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal'
            }
          ],
          alphabetize: {
            order: 'asc'
          }
        }
      ]
    }
  }
};
