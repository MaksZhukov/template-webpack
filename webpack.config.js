const path = require('path');
const argv = require('yargs').argv;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js'
	},
	devtool: isDevelopment ? 'source-map' : 'none',
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		inline: true,
		compress: true,
		open: true,
		overlay: true,
	},
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{
				test: /\.sass$/,
				use: [
					isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDevelopment
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: isDevelopment
						}
					}
				]
			},
			{
				test: /\.(png|jp(e*)g|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'img/',
							publicPath: 'img/'
						}
					}
				]
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/',
							publicPath: 'fonts/'
						}
					}
				]
			},
			{
				test: /\.ts$/,
				use: 'ts-loader'
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin('dist', {}),
		new MiniCssExtractPlugin({
			filename: 'style.css'
		}),
		new HtmlWebpackPlugin({
			inject: false,
			template: './src/index.html',
			filename: 'index.html'
		})
	],
	optimization: isProduction
		? {
				minimizer: [
					new UglifyJsPlugin({
						cache: true,
						parallel: true,
						sourceMap: true,
						uglifyOptions: {
							compress: {
								inline: false,
								warnings: false,
								drop_console: true,
								unsafe: true
							}
						}
					}),
					new OptimizeCSSAssetsPlugin({})
				]
		  }
		: {}
};
