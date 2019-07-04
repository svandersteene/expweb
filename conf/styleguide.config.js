// Enable babel
const path = require("path");
const StyleLintPlugin = require("stylelint-webpack-plugin");

// Fetch version from package
const { version } = require("../package.json");

const getStyleLoader = (modules = false) => [
    "style-loader",
    {
        loader: "css-loader",
        query: {
            sourceMap: true,
            url: true,
            modules,
            localIdentName: "[path][name]__[local]--[hash:base64:5]",
        },
    },
    "resolve-url-loader",
    {
        loader: "postcss-loader",
        query: {
            config: {
                path: path.resolve(__dirname, "../conf/postcss.config.js"),
            },
        },
    },
    {
        loader: "sass-loader",
        query: {
            sourceMap: true,
            includePaths: [path.resolve(__dirname, "../node_modules")],
        },
    },
];

const webpackConfig = {
    context: path.resolve(__dirname, "../src"),
    module: {
        rules: [
            // Javascripts
            {
                test: /\.js$/,
                use: ["eslint-loader"],
                enforce: "pre",
            },
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loader: "babel-loader",
            },
            // Scss
            {
                test: /\.module\.scss$/,
                use: getStyleLoader(true),
            },
            {
                test: /\.scss$/,
                use: getStyleLoader(),
                exclude: /\.module\.scss$/,
            },
            // Image loader
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                        query: {
                            name: "[md5:hash:hex].[ext]",
                        },
                    },
                    {
                        loader: "image-webpack-loader",
                        query: {
                            optipng: {
                                enabled: false,
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        modules: [path.resolve(__dirname, "../node_modules")],
    },
    plugins: [
        new StyleLintPlugin({
            files: ["**/*.scss"],
        }),
    ],
    devtool: "source-map",
};

// Export config
module.exports = {
    title: process.env.TITLE,
    components: "../src/components/*/**/*.js",
    ignore: ["**/test.js"],
    require: ["../src/styles/index.scss"],
    styleguideDir: path.resolve(__dirname, "../public/__styleguide"),
    template: {
        head: {
            links: [
                {
                    rel: "stylesheet",
                    href:
                        "https://fonts.googleapis.com/css?family=Nunito+Sans:300,400,600,700,900",
                },
            ],
        },
    },
    version,
    webpackConfig,
};
