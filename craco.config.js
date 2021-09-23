const { resolve } = require("path");
const WorkboxPlugin = require('workbox-webpack-plugin');

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

    webpack: {
        mode: 'extends',
        plugins: [
            new WorkboxPlugin.GenerateSW({
                // these options encourage the ServiceWorkers to get in there fast
                // and not allow any straggling "old" SWs to hang around
                clientsClaim: true,
                skipWaiting: true,
            }),
        ],
    }
}