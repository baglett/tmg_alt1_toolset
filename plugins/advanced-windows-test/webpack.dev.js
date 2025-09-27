const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    devtool: 'source-map',
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
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    externals: [
        "sharp",
        "canvas",
        "electron/common"
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            '@tmg-alt1/mouse-text-tool': path.resolve(__dirname, '../../components/mouse-text-tool/dist'),
            '@tmg-alt1/advanced-overlay-windows': path.resolve(__dirname, '../../components/advanced-overlay-windows/src'),
            '@shared': path.resolve(__dirname, '../../shared')
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
        port: 9000,
        hot: true,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    }
};