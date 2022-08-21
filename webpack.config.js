let mode = 'development'
if (process.env.NODE_ENV === 'production') {
	mode = 'production'
}
console.log(mode + ' mode')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require("copy-webpack-plugin")

const globule = require('globule')
const paths = globule.find(['src/pug/*.pug'])

module.exports = {
	mode,
	output: {
		filename: 'js/[name].js',
		// assetModuleFilename: 'assets/[hash][ext][query]', // Hash name
		assetModuleFilename: 'assets/[name][ext][query]',
		clean: true
	},
	devServer: {
		open: true,
		static: {
			directory: './src',
			watch: true
		}
	},
	devtool: 'source-map',
	plugins: [
		// new HtmlWebpackPlugin({
		// 	filename: 'index.html',
		// 	template: './src/pug/index.pug'
		// }),
		// new HtmlWebpackPlugin({
		// 	filename: 'about.html',
		// 	template: './src/pug/about.pug'
		// }),
		...paths.map((path) => {
			return new HtmlWebpackPlugin({
				template: path,
				filename: `${path.split(/\/|.pug/).splice(-2, 1)}.html`
			})
		}),
		new MiniCssExtractPlugin({
			// Hash in css file name
			// filename: '[name].[contenthash].css'
			filename: 'css/[name].css'
		}),
		new CopyPlugin({
			patterns: [
				{ from: "src/img", to: "img" }
			],
		}),
	],
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader'
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					(mode === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										'postcss-combine-media-query',
									],
									// [
									// 	'postcss-preset-env',
									// 	{
									// 		// Options
									// 	}
									// ],
								]
							}
						}
					},
					'sass-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'img/[name][ext][query]'
				}
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext][query]'
				}
			},
			{
				test: /\.pug$/,
				loader: 'pug-loader',
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					},
				}
			}
		]
	}
}