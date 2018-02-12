module.exports = {
  "parser": "babel-eslint",
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
  },
  "parserOptions": {
    "ecmaFeatures": {
      "modules": true,
      "jsx": true
    },
    "allowImportExportEverywhere": false,
    "sourceType": "module"
  },
  "settings": {
    "react": {
      "pragma": "h"
    }
  },
  "globals": {
    "sleep": 1,
    "chrome": false
  },
  "rules": {
    "react/jsx-no-bind": [2, { "ignoreRefs": true }],
    "react/jsx-no-duplicate-props": 2,
    "react/self-closing-comp": 2,
    "react/prefer-es6-class": 2,
    "react/no-string-refs": 2,
    "react/require-render-return": 2,
    "react/no-find-dom-node": 2,
    "react/no-is-mounted": 2,
    "react/jsx-no-comment-textnodes": 2,
    "react/jsx-curly-spacing": 2,
    "react/jsx-no-undef": 2,
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "no-empty": 0,
    "no-console": "off",
    "no-empty-pattern": 0,
    "no-cond-assign": 1,
    "semi": [
      "error",
      "always"
    ],
    "camelcase": 0,
    "comma-style": 2,
    "comma-dangle": [2, "never"],
    "indent": [
      "error",
      4
    ],
    "no-mixed-spaces-and-tabs": [2, "smart-tabs"],
    "no-trailing-spaces": [2, { "skipBlankLines": true }],
    "max-nested-callbacks": [2, 3],
    "no-eval": 2,
    "no-implied-eval": 2,
    "no-new-func": 2,
    "guard-for-in": 2,
    "eqeqeq": 1,
    "no-else-return": 2,
    "no-redeclare": 2,
    "no-dupe-keys": 2,
    "radix": 2,
    "strict": [2, "never"],
    "no-shadow": 0,
    "no-delete-var": 2,
    "no-undef-init": 2,
    "no-shadow-restricted-names": 2,
    "handle-callback-err": 0,
    "no-lonely-if": 2,
    "keyword-spacing": 2,
    "constructor-super": 2,
    "no-this-before-super": 2,
    "no-dupe-class-members": 2,
    "no-const-assign": 2,
    "prefer-spread": 2,
    "no-useless-concat": 2,
    "object-shorthand": "off",
    "no-inner-declarations": "off",
    "react/no-unknown-property": [2, { ignore: ['class'] }]
  }
}