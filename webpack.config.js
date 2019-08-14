const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const PostcssPresetEnv = require(`postcss-preset-env`);
const OptimizeCssAssetsPlugin = require(`optimize-css-assets-webpack-plugin`);
const webpack = require(`webpack`);

module.exports = (env, {mode}) => {
  console.log(mode);
  return {
    output: {
      filename: `js/[name].[hash].js`
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
          test: /\.html$/,
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
          test: /\.(jpe?g|png|svg|webp|fbx|gltf)$/,
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
          test: /\.css$/,
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
        filename: `./src/css/style.[contenthash].css`
      }),
      new OptimizeCssAssetsPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
