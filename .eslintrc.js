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
        "no-inner-declarations": "off"
    },
    "globals": {
        "chrome": false
    }
};
