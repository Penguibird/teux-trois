module.exports = {
    root: true,
    "plugins": [
        "@emotion/eslint-plugin"
    ],
    "rules": {
        "no-empty-pattern": "off"
    },
    "extends": [
        "react-app",
        "react-app/jest"
    ],
    parserOptions: {
        project: ["tsconfig.json"],
        sourceType: "module",
    },
    
    "overrides": [
        {
            "files": [
                "**/*.stories.*"
            ],
            "rules": {
                "import/no-anonymous-default-export": "off"
            }
        }
    ]
}