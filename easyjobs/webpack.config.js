const path = require( 'path' );
let getEntries = require( './blocks/config/getEntries' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const MiniCSSExtractPlugin = require( 'mini-css-extract-plugin' );
const plugins = defaultConfig.plugins.filter(
	( plugin ) =>
		plugin.constructor.name != 'MiniCssExtractPlugin' &&
		plugin.constructor.name != 'CleanWebpackPlugin'
);
const blocksFolder = __dirname + '/blocks/blocks';
let blockEntries = getEntries( blocksFolder );
let allEntries = {
	...blockEntries,
	'blocks/dist': './blocks/index.js',
};
const config = {
	...defaultConfig,
	entry: allEntries,
	output: {
		path: path.resolve( __dirname ),
		filename: '[name]/index.js',
	},
	plugins: [
		...plugins,
		new MiniCSSExtractPlugin( {
			filename: '[name]/style.css',
		} ),
	],
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.(jpg|png|gif)$/,
				type: 'asset/resource',
				generator: {
					filename: 'dist/images/[name][ext]',
				},
			},
		],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor-bundle',
					chunks: 'all',
				},
			},
		},
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
};
module.exports = config;
