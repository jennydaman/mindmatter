module.exports = {
    "parserOptions": {
        "sourceType": "module"
    },
    "env": {
        "browser": true,
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
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-inner-declarations": "off",
        "no-console": "off",
        "prefer-template": "warn",
        "no-unused-vars": "warn",
        "quote-props": [
            "warn",
            "as-needed"
        ]
    },
    "globals": {
        "chrome": false
    }
};
