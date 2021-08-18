const { resolve } = require("path");

module.exports = {
    reactScriptsVersion: "react-scripts" /* (default value) */,
    style: {

    },
    babel: {
        mode: 'extends',
        plugins: [
            "@emotion/babel-plugin"
        ]
    },
    
    // webpack: {
    //     // mode: 'extends',
    //     alias: {
    //         '@': resolve(__dirname, 'src')
    //     }
    // }
}