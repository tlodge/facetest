module.exports = {
    entry: './index.js',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: [/\.svg$/],
                exclude: /node_modules/,
                use: ['svg-inline-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.css']
    },
    output: {
        path: __dirname + '/dist',
        filename: '/dist/name.js',
        publicPath: '/',
        filename: 'main.js'
    },
    devServer: {
        contentBase: '/dist'
    }
};