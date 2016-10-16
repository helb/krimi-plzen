const webpack = require("webpack");
const srcdir = "./assets/js/";

module.exports = {
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: "babel",
            query: {
                presets: ["es2015"],
                cacheDirectory: true,
                plugins: []
            }
        }, {
            test: /\.json$/,
            loaders: ["json"]
        }]
    },
    devtool: "source-map",
    devServer: {
        contentBase: "build",
        hot: true,
        progress: true
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery"
        // })
    ],
    stats: {
        colors: true
    },
    externals: {
        "raven-js": "Raven",
        "jquery": "jquery"
    },
    entry: {
        base: srcdir + "base.js",
        index: srcdir + "index.js",
        article: srcdir + "article.js"
        // summernoteGalleryPlugin: srcdir + "summernote-gallery-plugin.js"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "static/js/"
    }
};
