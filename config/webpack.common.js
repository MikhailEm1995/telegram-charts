const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = (...paths) => path.resolve.apply(__dirname, ['src', ...paths]);
const root = (...paths) => path.resolve.apply(__dirname, [...paths]);

module.exports = {
    entry: {
        app: src('index.js')
    },
    output: {
        path: root('dist'),
        filename: '[name].[hash].bundle.js'
    },
    resolve: {
        extensions: ['.js', '.css', '.pcss'],
        alias: {
            _constants: src('constants'),
            _js: src('js'),
            _css: src('css'),
            _html: src('html')
        }
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.pug$/, exclude: /node_modules/, loader: 'pug-loader' },
            {
                test: /\.p?css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: { path: root('./config') }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: src('index.pug')
        })
    ]
};
