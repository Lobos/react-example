const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    // 需要编译的入口文件，增加了react-hot-loader的配置
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3001',
      'webpack/hot/only-dev-server',
      './src/index.js',
    ],
  },
  output: {
    // 输出文件名称规则，这里会生成 'app.js'
    filename: '[name].js',
    publicPath: '/',
  },

  // 引用但不打包的文件
  externals: { react: 'React', 'react-dom': 'ReactDOM' },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

  resolve: {
    // 给src目录一个路径，避免出现'../../'这样的引入
    alias: { _: path.resolve(__dirname, 'src') },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',

          // 可以在这里配置babelrc，也可以在项目根目录加.babelrc文件
          options: {

            // false是不使用.babelrc文件
            babelrc: false,

            // webpack2 需要设置modules 为false
            presets: [
              ['es2015', { modules: false }],
              'react',
            ],

            // babel的插件
            plugins: [
              'react-hot-loader/babel',
              'react-require',
              'transform-object-rest-spread',
            ],
          },
        },
      },

      // 这是sass的配置，less配置和sass一样，把sass-loader换成less-loader即可
      // webpack2 使用use来配置loader，并且不支持字符串形式的参数了，必须使用options
      // loader的加载顺序是从后向前的，这里是 sass -> postcss -> css -> style
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },

          {
            loader: 'css-loader',

            // 开启了CSS Module功能，避免类名冲突问题
            options: {
              modules: true,
              localIdentName: '[name]-[local]',
            },
          },

          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  autoprefixer,
                ]
              },
            },
          },

          {
            loader: 'sass-loader',
          },
        ],
      },

      // 当图片文件大于10KB时，复制文件到指定目录，小于10KB转为base64编码
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
}
