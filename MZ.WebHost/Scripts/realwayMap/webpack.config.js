var path = require('path')
var webpack = require('webpack')

console.log(path.join(__dirname, 'dist'))
module.exports = {
    entry: [
        './app/index.js'
    ],
    output: {
        filename: './public/javascripts/bundle.js',
    },
    plugins: process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ] : [],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                include: __dirname,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}
