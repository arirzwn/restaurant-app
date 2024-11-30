const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: 'sw.bundle.js',
      clientsClaim: true,
      skipWaiting: true,
      ignoreURLParametersMatching: [/.*/],
      runtimeCaching: [
        {
          // Cache CSS, JS, and other static assets
          urlPattern: ({ request }) =>
            request.destination === 'style' ||
            request.destination === 'script' ||
            request.destination === 'image',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          // Cache API requests
          urlPattern: ({ url }) =>
            url.href.startsWith('https://restaurant-api.dicoding.dev/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'restaurant-api-cache',
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          // Cache images from API
          urlPattern: ({ url }) =>
            url.href.startsWith('https://restaurant-api.dicoding.dev/images/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'restaurant-image-cache',
            cacheableResponse: {
              statuses: [0, 200],
            },
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
      ],
    }),
  ],
});
