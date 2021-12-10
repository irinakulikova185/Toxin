const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");
const fs = require('fs');


const path = require('path');

let mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const pages_dir = path.join(__dirname, 'src/pages');
const pages = fs.readdirSync(pages_dir);
console.log(pages)
const paths = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
  }
const entryPoints = pages.map(page => ({ [page]: `${pages_dir}/${page}/index.js`, }));
const entryPointsCorrect = Object.assign({}, {'index': `${paths.src}/index.js`}, ...entryPoints);
console.log(entryPointsCorrect)  

const plugins = () => {
    const basePlugins = [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        ...pages.map(
            (page) =>
              new HtmlWebpackPlugin({
                filename: `${page}.html`,
                template: `${pages_dir}/${page}/${page}.pug`,
                chunks: [page, 'index'],
              })
          ),
    ];
  
    if (mode === 'production') {
      basePlugins.push(
        new ImageMinimizerPlugin({
            minimizerOptions: {
              plugins: [
                ["gifsicle", { interlaced: true }],
                ["mozjpeg", { progressive: true, quality: 80 }],
                ["optipng", { optimizationLevel: 5 }],
                // Svgo configuration here https://github.com/svg/svgo#configuration
                // [
                //   "svgo",
                //   {
                //     plugins: extendDefaultPlugins([
                //       {
                //         name: "removeViewBox",
                //         active: false,
                //       },
                //       {
                //         name: "addAttributesToSVGElement",
                //         params: {
                //           attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                //         },
                //       },
                //     ]),
                //   },
                // ],
              ],
            },
            // loader: false,
          }),
      )
    }
  
    return basePlugins;
  };
  
module.exports = {
    mode: mode,
    entry: entryPointsCorrect,
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist/'),
        publicPath: "/",
        assetModuleFilename: "assets/[hash][ext][query]",
        clean: true,
    },
    resolve: {
        alias: {
          Fonts: path.resolve(__dirname, `${paths.src}/fonts/`),
        },
      },
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    devServer: {
        historyApiFallback: true,
        static: './dist',
        open: 'form-elements.html',
        compress: true,
        hot: true,
        port: 3000,
      },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
                },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[hash][ext][query]'
                  }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[hash][ext][query]'
                  }
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                exclude: /(node_modules|bower_components)/,
            }, 
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },  
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    (mode === 'development') ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {}
                                        ,
                                    ],
                                ],
                            },
                        },
                    },
                    "sass-loader",
                ],
            },
        ]
    },
    plugins: plugins()
    
}