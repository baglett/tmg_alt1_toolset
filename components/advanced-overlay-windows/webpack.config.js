const path = require("path");
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
        filename: "[name].js",
        library: {
            type: "umd",
            name: "AdvancedOverlayWindows",
            export: "default"
        },
        clean: true,
        globalObject: 'this'
    },
    externals: [
        "alt1",
        "sharp",
        "canvas",
        "electron/common"
    ],
    resolve: {
        ...baseConfig.resolve,
        extensions: [".tsx", ".ts", ".js"]
    }
});