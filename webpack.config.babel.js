import path, {resolve} from 'path'
import {DefinePlugin, EnvironmentPlugin} from 'webpack'
import WXAppWebpackPlugin from 'wxapp-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'

const environment = process.env.NODE_ENV
const srcDir = resolve('src')
const relativeFileLoader = (ext = '[ext]') => {
    return {
        loader: 'file-loader',
        options: {
            useRelativePath: true,
            name: `[name].${ext}`,
            context: srcDir
        }
    }
}

export default {
    entry: {
        app: [
            './src/app.js'
        ]
    },
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: resolve('dist')
    },
    resolve: {
        modules: [resolve(__dirname, 'src'), 'node_modules'],
        alias: {
            '@src': resolve(__dirname, './src'),
            '@components': resolve(__dirname, './src/components'),
            '@images': resolve(__dirname, './src/images'),
            '@utils': resolve(__dirname, './src/utils'),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {presets: ['es2015']},
                exclude: '/node_modules/'
               },
            {
            test: /\.js$/,
            include: /src/,
            loader: 'eslint-loader',
            options: {
                formatter: require('eslint-friendly-formatter'),
                emitWarning: true
            }
        }, {
            test: /\.(png|jpg|gif)$/,
            include: /src/,
            use: relativeFileLoader()
        }, {
            test: /\.json$/,
            include: /src/,
            use: [{
                loader: 'file-loader',
                options: {
                    useRelativePath: true,
                    name: '[name].[ext]'
                }
            }, {
                loader: 'webpack-comment-remover-loader',
                options: {
                    includePaths: [srcDir]
                }
            }].filter(Boolean)
        }, {
            test: /\.(scss|wxss)$/,
            include: /src/,
            use: [relativeFileLoader('wxss'), {
                loader: 'px2rpx-loader',
                options: {
                    baseDpr: 1,
                    rpxUnit: 0.5
                }
            }, {
                loader: 'sass-loader',
                options: {
                    includePaths: [srcDir]
                }
            }]
        }, {
            test: /\.(wxml|axml|xml)$/,
            include: /src/,
            use: [relativeFileLoader('wxml'), {
                loader: 'wxml-loader',
                options: {root: srcDir}
            }]
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new EnvironmentPlugin({NODE_ENV: 'development'}),
        new DefinePlugin({ENVIRONMENT: JSON.stringify(environment)}),
        new CopyWebpackPlugin([{
            from: __dirname + '/src/images',
            to: __dirname + '/dist/images'
        }, {
            from: __dirname + '/src/components',
            to: __dirname + '/dist/components'
        }, {
            from: __dirname + '/src/static',
            to: __dirname + '/dist/'
        }, {
            from: '**/*.wxml',
            to: 'pages',
            context: path.join(__dirname, 'src/pages')
        }], {
            ignore: ['**/*.scss', '**/*.js']
        }),
        new WXAppWebpackPlugin()
    ],
    watchOptions: {
        ignored: /dist/,
        aggregateTimeout: 300
    }
}
