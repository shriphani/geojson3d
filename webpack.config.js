module.exports = {
  output: {
    library: 'geojson3d',
    libraryTarget: 'umd',
    path: __dirname,
    filename: 'bundle.js'
  },
  entry: {
    library: './index.js'
  },
  devServer: {
    contentBase: __dirname,
    compress: true,
    port: 8000
  },
  watch: true
}