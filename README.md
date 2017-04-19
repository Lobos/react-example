这是一个比较简单的demo，引导一下对React感兴趣的同学吧。感觉可能有点长，所以打算分几个部分来写。
1、环境和依赖、编译
2、dev server 和 react-hot-loader
3、react-router，react-redux
4、mock数据，前后端分离开发

现在其实有挺多start-kit，还有create-react-app这样的工具，这里不打算用这些，而是从空项目入手，让大家可以多了解一些配置是做什么用途的。另外从我的项目经验来看，前端现在的发展速度，想做一个通用的start-kit，一劳永逸是很难的。一般一个项目周期3-6个月左右，这个start-kit里面的大部分依赖包可能都升级了，很多配置可能就不可用了，比如babel5升到babel6。

整个demo里可能会有一些“私货”，比如自己写的组件，一些开发习惯等等，如果不喜欢的话，无视就好。

这里说一些配置环境和安装依赖包的经验：
1、添加新的东西之前，git commit一次，遇到问题跑不起来了，可以安全回到之前的环境。
2、加一点新的东西，运行一次，不要一次加很多东西，环境跑不起来了，也没法定位是哪个的问题。
3、最好明确的知道，为什么要用这个工具／组件？会带来什么样的收益，是否有其它更好的方式解决。使用的外部依赖越多，出现问题的概率也越高。

本文假设你已经了解了React的基本语法，和一些es6的语法。

## 安装nodejs
这里推荐node v7.6.0以上版本，因为后面会使用koa2。
可以[使用 n 或者 nvm 来管理node版本](http://yijiebuyi.com/blog/b1328ffe88cdde6b4102894635cf8f11.html)
**npm** npmjs和aws国内访问比较慢，可以换淘宝的镜像源，这里在项目根目录建一个.npmrc文件
```
phantomjs_cdnurl=http://cnpmjs.org/downloads
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
registry=https://registry.npm.taobao.org
```
也可以使用 [nrm 切换npm源](https://github.com/Pana/nrm)，很方便。
```
$ npm install -g nrm
$ nrm ls

* npm -----  https://registry.npmjs.org/
  cnpm ----  http://r.cnpmjs.org/
  taobao --  https://registry.npm.taobao.org/
  nj ------  https://registry.nodejitsu.com/
  rednpm -- http://registry.mirror.cqupt.edu.cn
  skimdb -- https://skimdb.npmjs.com/registry
  
$ nrm use taobao
```

## 创建一个项目
首先创建一个空的文件夹，在下面执行
```
$ npm init
```

##安装依赖包
```
$ npm install react react-dom --save

$ npm install webpack babel-core babel-loader babel-plugin-react-require babel-plugin-transform-object-rest-spread babel-preset-es2015 babel-preset-react autoprefixer css-loader less-loader postcss-loader sass-loader style-loader url-loader file-loader less node-sass --save-dev
```

**babel**

- babel-core
- babel-loader：babel的webpack插件。
- babel-plugin-react-require：如果出现 “React is not defined” 的问题，可以安装这个插件。原因是把React打包到项目里，而某些组件没有import React导致。建议不要把React打包到项目里。
- babel-plugin-transform-object-rest-spread：es6解构赋值插件。
- babel-preset-es2015：es6语法转换
- babel-preset-react：jsx语法转换

**css**

- autoprefixer：PostCSS插件，自动添加各种前缀
- css-loader：读取js文件中引入的css文件，内置了CSS Module的功能
- file-loader：处理js引入的文件
- less-loader：less语法转换为css
- postcss-loader：PostCSS转换器
- sass-loader：sass语法转换为css
- style-loader：把转换的css文件转为js模块
- url-loader：file-loader的封装，提供一些额外功能
- less：less-loader的依赖包
- node-sass：sass-loader的依赖包

## 使用eslint （可选）
推荐使用eslint做代码检查，安装依赖包，这里用了airbnb的代码规范
```
$ npm install babel-eslint eslint eslint-config-airbnb eslint-plugin-react eslint-plugin-jsx-a11y eslint-plugin-import eslint-import-resolver-webpack --save-dev
```

在项目根目录建一个.eslintrc文件，因为我是无分号党，所以semi设置了"never"
```
{
    "extends": ["airbnb"],
    "parserOptions": {
        "ecmaVersion": 2016,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "settings": {
        "import/parser": "babel-eslint",
        "import/resolver": {
            "webpack": {
                // webpack 文件路径
                "config": "webpack.config.js"
            }
        }
    },
    "rules": {
        // 允许js后缀
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        // 强制无分号
        "semi": [2, "never"]
    }
}
```

## 配置webpack config
建一个webpack.config.js文件。这里是一个比较常用的配置，有些细节的配置可以参考相关文档。
```
const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    // 需要编译的入口文件
    app: './src/index.js'
  },
  output: {
    path: path.join(__dirname, '/build'),

    // 输出文件名称规则，这里会生成 'app.js'
    filename: '[name].js'
  },

  // 引用但不打包的文件
  externals: { 'react': 'React', 'react-dom': 'ReactDOM' },

  plugins: [

    // webpack2 需要设置 LoaderOptionsPlugin 开启代码压缩
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    // Uglify的配置
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true
      }
    })
  ],

  resolve: {
    // 给src目录一个路径，避免出现'../../'这样的引入
    alias: { _: path.resolve(__dirname, 'src') }
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
              ['es2015', { 'modules': false }],
              'react'
            ],

            // babel的插件
            plugins: [
              'react-require',
              'transform-object-rest-spread'
            ]
          }
        }
      },

      // 这是sass的配置，less配置和sass一样，把sass-loader换成less-loader即可
      // webpack2 使用use来配置loader，并且不支持字符串形式的参数，x需要使用options
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
              localIdentName: '[name]-[local]'
            }
          },

          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  autoprefixer
                ]
              }
            }
          },

          {
            loader: 'sass-loader'
          }
        ]
      },

      // 当图片文件大于10KB时，复制文件到指定目录，小于10KB转为base64编码
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './images/[name].[ext]'
            }
          }
        ]
      }
    ]
  }
}
```

## 写一个Hello World，编译
src/index.js
```
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import '_/styles/index.scss'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div>Hello world.</div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

src/styles/index.scss
```
body {
  font-size: 14px;
}
```

console下执行
```
$ node_module/.bin/webpack

 Asset     Size  Chunks             Chunk Names
app.js  29.7 kB       0  [emitted]  app
   [0] ./src/styles/index.scss 1.24 kB {0} [built]
   [3] ./~/base64-js/index.js 3.5 kB {0} [built]
   [4] ./~/buffer/index.js 48.8 kB {0} [built]
   [5] ./~/buffer/~/isarray/index.js 131 bytes {0} [built]
   [6] ./~/css-loader/lib/css-base.js 2.19 kB {0} [built]
   [7] ./~/ieee754/index.js 2.08 kB {0} [built]
   [8] ./~/style-loader/fixUrls.js 3 kB {0} [built]
   [9] (webpack)/buildin/global.js 808 bytes {0} [built]
  [10] ./src/index.js 2.14 kB {0} [built]
  [11] ./~/css-loader?{"modules":true,"localIdentName":"[name]-[local]"}!./~/postcss-loader?{}!./~/sass-loader/lib/loader.js!./src/styles/index.scss 186 bytes {0} [built]
  [12] ./~/style-loader/addStyles.js 8.51 kB {0} [built]
    + 2 hidden modules
```
这里可能会有一个“DeprecationWarning: loaderUtils.parseQuery()”，babel-loader的问题，下个版本应该会修复

## 建一个server
我们这里使用koa2来做开发服务器，首先，安装koa
```
$ npm install koa koa-router koa-send save-dev
```

在demo文件夹下建一个index.html
```
<!doctype html>
<html>
  <head>
    <title>React Example</title>
  </head>
  <body>
    <div id='root'></div>
    <script src="/react.min.js"></script>
    <script src="/react-dom.min.js"></script>
    <script src="/app.js"></script>
  </body>
</html>
```

在根目录下建一个server.js
```
const Koa = require('koa')
const send = require('koa-send')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

router.get('/', async function (ctx) {
  await send(ctx, 'demo/index.html')
})

router.get('/app.js', async function (ctx) {
  await send(ctx, 'build/app.js')
})

// 线上会使用压缩版本的React，而在开发的时候，我们需要使用react-with-addons来查看错误信息
// 所以这里把React和ReactDOM代理到本地未压缩的文件
router.get('**/react.min.js', async function (ctx) {
  await send(ctx, 'demo/react-with-addons.js')
})
router.get('**/react-dom.min.js', async function (ctx) {
  await send(ctx, 'demo/react-dom.js')
})

app.use(router.routes())

app.listen(3000, function () {
  console.log('server running on http://localhost:3000')
})
```

在终端执行
```
$ node server.js
```

打开浏览器，输入 localhost:3000 ，就可以看到 “hello world” 了。

