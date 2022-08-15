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
     "ignorePatterns": ["*.html"],
    
    parserOptions: {
        project: ["tsconfig.json","extension/tsconfig.json", "functions/tsconfig.json"],
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