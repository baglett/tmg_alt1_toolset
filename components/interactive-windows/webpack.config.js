const path = require('path');
const { merge } = require('webpack-merge');

// Use shared base configuration
const baseConfig = {
    entry: './src/index.ts',
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'umd',
            name: 'InteractiveWindows',
        },
        clean: true,
    },
    externals: {
        'alt1': 'alt1'
    },
    optimization: {
        splitChunks: false, // Don't split chunks for component libraries
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 9002,
        hot: true,
        open: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    plugins: []
};

module.exports = baseConfig;