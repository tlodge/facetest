var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: {
        browser_webcam_driver: './server.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    mode: "production",
    target: "node",
    module: {

        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', "stage-0"]
                },
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
