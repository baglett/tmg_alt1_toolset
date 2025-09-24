const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { merge } = require("webpack-merge");
const baseConfig = require("../../shared/webpack.config.base.js");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = merge(baseConfig, {
    context: path.resolve(__dirname, "src"),
    entry: {
        "index": "./index.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        library: {
            type: "umd",
            name: "AdvancedWindowsTest"
        },
        clean: true,
        globalObject: 'this'
    },
    externals: [
        "sharp",
        "canvas",
        "electron/common"
    ],
    resolve: {
        ...baseConfig.resolve,
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            ...baseConfig.resolve.alias,
            '@tmg-alt1/advanced-overlay-windows': path.resolve(__dirname, '../../components/advanced-overlay-windows/src')
        }
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "index.html",
                    to: "index.html"
                },
                {
                    from: "appconfig.json",
                    to: "appconfig.json"
                },
                {
                    from: "../assets",
                    to: "assets",
                    noErrorOnMissing: true
                }
            ]
        })
    ],
    devServer: {
        ...baseConfig.devServer,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        headers: {
            ...baseConfig.devServer.headers,
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp"
        }
    }
});