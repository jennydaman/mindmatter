module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "allowImportExportEverywhere": false,
        "sourceType": "module"
    },
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "jquery": true        
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-inner-declarations": "off",
        "no-console": "off",
        "prefer-template": "off",
        "no-unused-vars": "warn",
        "quote-props": [
            "warn",
            "as-needed"
        ],
        "max-len": ["warn", {
            "code": 120
        }]
    },
    "globals": {
        "chrome": false
    }
};
