module.exports = {
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
            "warn",
            "always"
        ],
        "no-inner-declarations": "off",
        "no-console": "off",
        "prefer-template": "warn",
        "no-unused-vars": "off",
        "quote-props": [
            "warn",
            "as-needed"
        ]
    },
    "globals": {
        "chrome": false,
        "subjects": false,
        "notif": false
    }
};
