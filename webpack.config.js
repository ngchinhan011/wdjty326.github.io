var path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const uglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, options) => {
    const config = {
        entry: ['@babel/polyfill', './src/index.js'],
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: '[name].bundle.js',
            chunkFilename: '[name].[id].bundle.js'
        },
        optimization: {
            splitChunks: {
              cacheGroups: {
                vendors: {
                  name: 'vendors',
                  test: /[\\/]node_modules[\\/]/,
                  chunks: 'all'
                },
                styles: {
                  name: 'styles',
                  test: /\.(css)$/,
                  chunks: 'all',
                }
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                }, 
                {
                    test: /\.(css)$/,
                    exclude: /node_modules/,
                    use: [ miniCssExtractPlugin.loader, 'css-loader' ]
                },
                {
                    test: '/\.()$/',
                    exclude: /node_modules/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: './dist'
                        }
                    }
                },
                {
                    test: /\.()$/,
                    exclude: /node_modules/,
                    use: {
                      loader: 'url-loader',
                      options: {
                        name: '[name].[ext]?[hash]',  // 파일명 또는 파일해쉬값
                        publicPath: './dist/',  // 빌드 후 limit가 넘는 파일 위치
                        limit: 10000  // 10000byte 제한
                      }
                    }
                }
            ]
        },
        plugins: [
            new cleanWebpackPlugin(),
            new htmlWebpackPlugin({
                title: 'JeongTaekYu Portfolio',
                meta: {
                    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
                },
                template: './src/index.html'
            }),
            new miniCssExtractPlugin({
                filename: '[name].bundle.css',
                chunkFilename: '[name].[id].bundle.css'
            })
        ],
        resolve: {
            extensions: ['.js', '.jsx']
        }
    };

    if (options.mode === 'development') {
        config.mode = 'development';
        config.devServer = {
        port: 3000,
        contentBase: path.resolve(__dirname, 'public'),
        compress: true,
        watchContentBase: true
        };
    } else {
        config.mode = 'production';
        config.plugins = [
        ...config.plugins,
        ...[
            new uglifyJSWebpackPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
            })
        ]
        ];
    }


    return config;
};