const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { merge } = require("webpack-merge");
const baseConfig = require("../../shared/webpack.config.base.js");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = merge(baseConfig, {
    //tell webpack where to look for source files
    context: path.resolve(__dirname, "src"),
    entry: {
        //each entrypoint results in an output file
        //so this results in an output file called 'index.bundle.js' which is built from src/index.ts
        "index": "./index.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        // library means that the exports from the entry file can be accessed from outside
        library: { type: "umd", name: "DungeoneeringGateEngine" },
        clean: true
    },
    devtool: false,
    mode: "development",
    // prevent webpack from bundling these imports
    externals: [
        "sharp",
        "canvas",
        "electron/common"
    ],
    resolve: {
        extensions: [".wasm", ".tsx", ".ts", ".mjs", ".jsx", ".js"]
    },
    module: {
        // The rules section tells webpack what to do with different file types when you import them from js/ts
        rules: [
            { 
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                }
            },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
            // type:"asset" means that webpack copies the file and gives you an url to them when you import them from js
            { test: /\.(png|jpg|jpeg|gif|webp)$/, type: "asset/resource", generator: { filename: "[base]" } },
            { test: /\.(html|json)$/, type: "asset/resource", generator: { filename: "[base]" } },
            // file types useful for writing alt1 apps
            { test: /\.data\.png$/, loader: "alt1/imagedata-loader", type: "javascript/auto" },
            { test: /\.fontmeta.json/, loader: "alt1/font-loader" }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { 
                    from: "index.html",
                    to: "index.html"
                },
                {
                    from: "../assets",
                    to: "assets"
                },
                // Add our files
                {
                    from: "install.html",
                    to: "install.html"
                },
                {
                    from: "appconfig.json",
                    to: "appconfig.json"
                },
                {
                    from: "helperconfig.json",
                    to: "helperconfig.json"
                },
                {
                    from: "icon.png",
                    to: "icon.png",
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