const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const PostcssPresetEnv = require(`postcss-preset-env`);
const OptimizeCssAssetsPlugin = require(`optimize-css-assets-webpack-plugin`);
const webpack = require(`webpack`);

module.exports = (env, {mode}) => {
  console.log(mode);
  return {
    entry: `./src/js/index.js`,
    output: {
      filename: `[name].[hash].js`
    },
    devServer: {
      overlay: true,
      hot: true
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: {
            loader: `babel-loader`
          }
        },
        {
          test: /\.(html)$/,
          use: [
            {
              loader: `html-srcsets-loader`,
              options: {
                attrs: [`:src`, `:srcset`]
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|svg|webp)$/,
          use: {
            loader: `url-loader`,
            options: {
              limit: 1000,
              context: `./src`,
              name: `[path][name].[ext]`
            }
          }
        },
        {
          test: /\.(mp3|wav)$/,
          use: {
            loader: `file-loader`,
            options: {
              name: `[name].[ext]`,
              outputPath: `assets`
            }
          }
        },
        {
          test: /\.(css)$/,
          use: [
            mode === `production`
              ? MiniCssExtractPlugin.loader
              : `style-loader`,
            `css-loader`,
            `resolve-url-loader`,
            {
              loader: `postcss-loader`,
              options: {
                sourceMap: true,
                plugins: [
                  require(`postcss-import`),
                  require(`postcss-will-change`),
                  PostcssPresetEnv({stage: 0})
                ]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `./src/index.html`,
        filename: `./index.html`
      }),
      new MiniCssExtractPlugin({
        filename: `style.[contenthash].css`
      }),
      new OptimizeCssAssetsPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
