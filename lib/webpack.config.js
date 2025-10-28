const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MergeIntoSingle = require('webpack-merge-and-include-globally');
  

module.exports = {
    mode:'development',
    entry: './src/simustream.js',
    output: {
      filename: '[name]',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({

              use: 'css-loader'
            })
          }
        ],
      },
      plugins: [
        new ExtractTextPlugin("simu.min.css"),
        new CopyWebpackPlugin([
            {from:'src/images',to:'images'} ,
            {from:'src/css/fonts',to:'fonts'},
            {from:'src/config',to:'config'} 

        ]), 
        new MergeIntoSingle({
            files: {
              'simu.min.js': [
                'src/simustream.js',
                'src/analytics.js',
                'src/products-display.js'
              ],
              'simu.min.css': [
                'src/css/style.css',
                'src/css/fonts.css',
                'src/css/scrollbar.css',
                'src/css/price-plans.css'

              ]
            }
          })
      ]
    };

  