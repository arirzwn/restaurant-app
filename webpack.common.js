const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.resolve(__dirname, 'src/templates/index.html'),
    cache: true,
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'src/public/'),
        to: path.resolve(__dirname, 'dist/'),
        globOptions: {
          ignore: ['**/images/**'],
        },
      },
      {
        from: path.resolve(__dirname, 'src/public/images/'),
        to: path.resolve(__dirname, 'dist/images/'),
      },
      {
        from: path.resolve(__dirname, 'src/public/app.webmanifest'),
        to: path.resolve(__dirname, 'dist/'),
      },
      {
        from: path.resolve(__dirname, 'dist/images/heros/'),
        to: path.resolve(__dirname, 'dist/images/heros/'),
      },
    ],
  }),
  new FaviconsWebpackPlugin({
    logo: path.resolve(__dirname, 'src/public/icons/icon.png'),
    mode: 'webapp',
    devMode: 'webapp',
    favicons: {
      appName: 'Restaurant Apps',
      appDescription: 'Restaurant Catalog Application',
      developerName: 'Ari',
      developerURL: 'https://github.com/arirzwn',
      background: '#ffffff',
      theme_color: '#ffffff',
      icons: {
        coast: false,
        yandex: false,
      },
    },
  }),
];

// Tambahkan BundleAnalyzerPlugin hanya jika dalam mode development
if (process.env.NODE_ENV === 'development') {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  plugins: [
                    ['jpegtran', { progressive: true }],
                    ['optipng', { optimizationLevel: 3 }],
                  ],
                },
              },
              generator: [
                {
                  preset: 'webp',
                  implementation: ImageMinimizerPlugin.imageminGenerate,
                  options: {
                    plugins: ['imagemin-webp'],
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 3 }],
            ],
          },
        },
        generator: [
          {
            preset: 'webp',
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ['imagemin-webp'],
            },
          },
        ],
      }),
    ],
  },
  plugins: plugins,
};
