const webpack = require('webpack');


const config = {
  
  entry: './index.js',
  
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },

  module:{
    rules: [

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      },

      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }

    ]
  }

}

module.exports = config;