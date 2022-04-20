const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUT_DIR = path.resolve(__dirname, 'dist');

const config = {
    mode: "production",
    entry: SRC_DIR+"/index.ts",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: OUT_DIR,
        filename: 'index.js',
        library: 'delfi',
        libraryTarget: 'umd'
    },
    target: 'node'
};

module.exports = config;
