const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MergeIntoSingle = require('webpack-merge-and-include-globally');
var StringReplacePlugin = require("string-replace-webpack-plugin");

const injectableReplacements={"vendor":"vendor.js","simu":"simu.js"};


  


module.exports = {
    mode:'development',
    entry: './src/simu-player.js',
    output: {
      filename: '[name]',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        { 
          test: /index.html$/,
          loader: StringReplacePlugin.replace({
              replacements: [
                  {
                      pattern: /<!-- @js vendor --> (.*) <!-- @end-js vendor -->/ig,
                      replacement: function (match, p1, offset, string) {
    
                       return "<script src='vendor.js'></script>";
                      }
                    },
                    {
                      pattern: /<!-- @js simu --> (.*) <!-- @end-js simu -->/ig,
                      replacement: function (match, p1, offset, string) {
    
                       return "<script src='simu.js'></script>";
                      }
                    }
                    ,
                    {
                      pattern: /<!-- @css simu --> (.*) <!-- @end-css simu -->/ig,
                      replacement: function (match, p1, offset, string) {
    
                       return "<link rel='stylesheet' href='simu.css'>";
                      }
                    }

              ]})
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: "html-loader",
                options: { minimize: false }
              }
            ]
          }
        ]
      },
      plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            inject:false
          }),
        new CopyWebpackPlugin([
            {from:'../lib/src/images',to:'images'} ,
            {from:'../lib/src/css/fonts',to:'fonts'},
            {from:'../lib/src/config',to:'config'}, 
            {from:'./src/favicon',to:'favicon'}, 
            {from:'./src/config/player-settings.json',to:'config/player-settings.json'} 

        ]), 
        new MergeIntoSingle({
            files: {
              'simu.js': [
                '../lib/src/simustream.js',
                '../lib/src/analytics.js',
                '../lib/src/products-display.js',
                '../lib/src/payment.js',
                './src/simu-player.js'
              ],
              'simu.css': [
                '../lib/src/css/style.css',
                '../lib/src/css/style.css',
                '../lib/src/css/fonts.css',
                '../lib/src/css/scrollbar.css',
                '../lib/src/css/price-plans.css'
              ],
              'vendor.js': [
                'node_modules/moment/moment.js'
              ]
            }
          }),
          new StringReplacePlugin()
      ]
    };

  