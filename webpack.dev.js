const common = require('./webpack.common')
const merge = require('webpack-merge')
const webpack = require('webpack')


module.exports = merge(common, {
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        allowedHosts: [
            'tbtapi.imztj.cn'
        ],
        contentBase: 'public',
        open: 'Chrome',
        hot: true,
    },
    devtool: 'inline-source-map',
})