module.exports = {
    root: true,
    "plugins": [
        "@emotion/eslint-plugin"
    ],
    rules: {
        'import/extensions': 'off',
        'react/jsx-filename-extension': 'off',
        'linebreak-style': 'off',
        'react/function-component-definition': 'off',
        eqeqeq: 'off',
        'no-param-reassign': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/no-array-index-key': 'off',
        'max-len': 'off',
        'consistent-return': 'off',
        'no-control-regex': 'off',
        'no-console': 'off',
        // * Makes reducer handlers way harder to read
        'no-case-declarations': 'off',
        'react/destructuring-assignment': 'warn',
        //* Typescript handles those way better
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-use-before-define': 'off',
        'import/no-unresolved': 'off',
        'no-continue': 'off',
        'no-tabs': 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'no-plusplus': 'off',
        'import/prefer-default-export': 'off',
        'react/require-default-props': 'off',
        'no-nested-ternary': 'off',
        'no-restricted-syntax': 'off',
        'react/jsx-wrap-multilines': 'off',
        'react/jsx-closing-tag-location': 'off',
        'react/jsx-props-no-spreading': 'off',
        'import/no-extraneous-dependencies': 'warn',
        'guard-for-in': 'off',
        curly: ['error', 'multi-or-nest'],
        'nonblock-statement-body-position': ['error', 'below'],
        'react-hooks/exhaustive-deps': ['warn', {
          additionalHooks: 'useEffectOnceOnly|useEffectOnUpdate'
        }]
      },
    "extends": [
        "react-app",
        "react-app/jest"
    ],   
     "ignorePatterns": ["*.html"],
    
    parserOptions: {
        project: ["tsconfig.json", "functions/tsconfig.json"],
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