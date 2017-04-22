这是一个比较简单的demo，引导一下对React感兴趣的同学吧。假定的需求是写一个图书管理的后台。稍微有点长，大概分下面几个部分。

0. 环境和依赖、编译
0. dev server
0. react-hot-loader
0. react-router
0. CSS Module
0. react-ui组件库
0. 高阶组件
0. mock数据
0. CRUD
0. 在弹出层中编辑
0. 项目结构

现在有挺多start-kit，还有create-react-app这样的工具，这里不打算用这些，而是从空项目入手，让大家可以多了解一些配置是做什么用途的。从我的项目经验来看，前端现在的发展速度，想做一个通用的start-kit，一劳永逸是很难的。一般一个项目周期3-6个月左右，这个start-kit里面的大部分依赖包可能都升级了，很多配置可能就不可用了，比如babel5升到babel6。

整个demo里可能会有一些“私货”，比如自己写的组件，一些开发习惯等等，如果不喜欢的话，无视就好。

这里贴出来的代码有些可能并不完整，每一段结束我都打了一个tag，可以checkout出来执行。如果有报错，先看下nodejs的版本是否大于 7.6.0，是否有依赖没有安装。

本文假设你已经了解了React的基本语法，和一些es6的语法。


## 环境和依赖、编译

### 安装nodejs
这里需要node v7.6.0以上版本，因为后面会使用koa2。
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

### 创建一个项目
首先创建一个空的文件夹，在下面执行

```
$ npm init
```

### 安装依赖包

```
$ npm install react react-dom prop-types --save

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

### 使用eslint （可选）
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
        "react/forbid-prop-types": 0,
        // 强制无分号
        "semi": [2, "never"]
    }
}
```

### 配置webpack config
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

### 写一个Hello world
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

```
$ git checkout step-1
```

## 建一个server
我们这里使用koa2来做开发服务器，首先，安装koa

```
$ npm install koa koa-router koa-send http-proxy save-dev
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

// 线上会使用压缩版本的React，而在开发的时候，我们需要使用react-with-addons的版本来查看错误信息
// 所以这里我通常会把React和ReactDOM代理到本地未压缩的文件
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

打开浏览器，输入 localhost:3000 ，就可以看到 “Hello world” 了。

```
$ git checkout step-2
```


## 加入react-hot-loader
hot loader有两个方案，一个方案是使用 webpack-dev-middleware和webpack-hot-middleware，优点是可以和开发服务器共用一个server，缺点是配置比较繁琐。
另一个方案是用react-hot-loader，优点是配置比较简单，缺点是要另外启动一个server来代理资源。
因为react-hot-loader 3现在还是beta版，所以需要加 @next 安装

```
npm install --save react-hot-loader@next webpack-dev-server --save-dev
```

在项目根目录添加一个 webpack.dev.config.js 文件，和webpack.config.js稍有不同，去除了代码压缩的配置，增加了react-hot-loader的插件配置

```
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
```

在 server.js 里加入代码，启动hot loader server

```
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.dev.config')

const DEVPORT = 3001

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  quiet: false,
  noInfo: true,
  stats: {
    colors: true
  }
}).listen(DEVPORT, 'localhost', function (err, result) {
  if (err) {
    return console.log(err)
  }
})
```

把 app.js 重定向到 webpack-dev-server

```
/* 删掉这一段
router.get('/app.js', async function (ctx) {
  await send(ctx, 'build/app.js')
})
*/
router.get('**/*.js(on)?', async function (ctx) {
  ctx.redirect(`http://localhost:${DEVPORT}/${ctx.path}`)
})
```

这时执行 node server 访问 localhost:3000 会出现一个 “React Hot Loader: App in ..../index.js will not hot reload correctly because index.js uses <App /> during module definition. For hot reloading to work, move App into a separate file and import it from index.js.” 警告，我们需要拆分 src/index.js 文件

src/index.js

```
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

// 注意，要增加这句
module.hot && module.hot.accept()
```

src/App.js

```
import React, { Component } from 'react'

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

export default App
```

重启服务，修改App.js代码试试看吧。

```
$ git checkout step-3
```

## 加入react-router 4.0
```
$ npm install react-router-dom --save
```

这里使用hashRouter，修改App.js代码（暂时忽略样式）

```
import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import Author from '_/components/author'
import Category from '_/components/category'
import Book from '_/components/book'

import '_/styles/index.scss'

function App() {
  return (
    <Router>
      <div>
        <div>
          <Link to="/author">作者</Link>
          <Link to="/category">分类</Link>
          <Link to="/book">书籍</Link>
        </div>

        <div>
          <Route path="/author" component={Author} />
          <Route path="/category" component={Category} />
          <Route path="/book" component={Book} />
        </div>
      </div>
    </Router>
  )
}

export default App
```

在 components 下面建3个文件夹author/category/book，每个放入一个index.js文件，先简单render一个div

```
export default function () {
  return (
    <div>书籍列表</div>
  )
}
```
启动服务，点击链接，看下url变化

```
$ git checkout step-4
```

## CSS Module
css-loader 提供了CSS Module的功能，在开发SPA应用的时候，可以减少css类名冲突带来的问题
之前webpack已经配置过了，现在可以直接使用

```
options: {
  modules: true,
  // 这个的配置是 "文件名-类名"，比较简单，实际项目中，可以加入hash，例如'[name]-[local]-[hash:base64:5]'
  localIdentName: '[name]-[local]',
},
```

在styles文件夹下面加两个文件
src/styles/header.scss

```
.container {
  width: 100%;
  height: 50px;
}
```

src/styles/menu.scss

```
.container {
  width: 200px;
}
```

修改App.js

```
import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import Author from '_/components/author'
import Category from '_/components/category'
import Book from '_/components/book'

import '_/styles/index.scss'
// 和引入js文件一样
import _header from '_/styles/header.scss'
import _menu from '_/styles/menu.scss'

function App() {
  return (
    <Router>
      <div>
        {/* 和使用对象一样使用类名 */}
        <div className={_header.container}>
          React Example
        </div>

        <div className={_menu['container']}>
          <Link to="/author">作者</Link>
          <Link to="/category">分类</Link>
          <Link to="/book">书籍</Link>
        </div>

        <div>
          <Route path="/author" component={Author} />
          <Route path="/category" component={Category} />
          <Route path="/book" component={Book} />
        </div>
      </div>
    </Router>
  )
}

export default App
```

render后的代码，可以看到两个组件使用了两个相同的类名，但是在两个不同的文件里，生成的类名也不同

```
<div class="header-container">...</div>
<div class="menu-container">...</div>
```

完整代码checkout step-5

```
$ git checkout step-5
```

## 使用ui组件库
组件库这里加点私货，使用了[react-ui](https://github.com/Lobos/react-ui)。[文档可以参考这里](http://lobos.github.io/react-ui/)。

```
$ npm install rctui classnames query-string refetch --save
```

在src/components/author下面加一个List.js文件，这是一个比较常见的使用state的流程，组件加载后获取数据，重新设置数据，再渲染

```
import React, { Component } from 'react'
import { Table, Card } from 'rctui'
import fetch from 'refetch'

class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        list: [],
      },
    }
  }

  componentWillMount() {
    fetch.get('/authorlist.json').then((res) => {
      // 实际项目中，这里最好判断一下组件是否已经unmounted
      this.setState({ data: res.data })
    })
  }

  render() {
    // 这里可以根据data的状态，返回其它内容，例如
    // if (!this.state.data) return <Loading />
    
    return (
      <Card>
        <Card.Header>作者列表</Card.Header>
        <Table
          data={this.state.data.list}
          columns={[
            { name: 'id', header: 'ID' },
            { name: 'name', header: '姓名' },
            { name: 'nationality', header: '国籍' },
            { name: 'birthday', header: '生日' },
          ]}
        />
      </Card>
    )
  }
}

export default List
```

修改src/components/author/index.js，增加一条Route

```
  render() {
    const { match } = this.props

    return (
      <div>
        <Route
          exact
          path={`${match.url}`}
          {/* 这里可以直接用 component={List}，不过我们后面要对这里做一些修改 */}
          render={() => <List />}
        />
      </div>
    )
  }
```

在demo下加了一个authorlist.json

```
{
  "data": {
    "total": 2,
    "page": 1,
    "size": 10,
    "list": [
      {
        "id": 1,
        "name": "乔治.R.R.马丁",
        "birthday": "1948-09-20",
        "nationality": "美国"
      },
      {
        "id": 2,
        "name": "托尔金",
        "birthday": "1892-01-03",
        "nationality": "英国"
      }
    ]
  }
}
```

完整代码

```
$ git checkout step-6
```

## 高阶组件
在上面的示例中，通过[ fetch -> setState -> render ] 这样一个流程来处理数据。一个项目中，可能有很多地方会有类似的场景和使用方式。可以通过高阶组件的方式来抽取这个流程，使它可以在更多的地方使用。
在项目中新建一个文件 src/hoc/fetch.js

```
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import refetch from 'refetch'
import { Mask, Spin } from 'rctui'

const PENDING = 0
const SUCCESS = 1
const FAILURE = 2

export default function (Origin) {
    class Fetch extends Component {
    constructor(props) {
      super(props)
      this.state = {
        data: null,
        status: props.fetch ? PENDING : SUCCESS,
      }

      this.fetchData = this.fetchData.bind(this)
    }

    componentWillMount() {
      if (this.props.fetch) this.fetchData()
      this.isUnmounted = false
    }

    componentWillUnmount() {
      this.isUnmounted = true
    }

    fetchData() {
      let { fetch } = this.props
      if (typeof fetch === 'string') fetch = { url: fetch }
      
      // 设置状态为加载中
      this.setState({ data: null, status: PENDING })
      refetch.get(fetch.url, fetch.data).then((res) => {
        // 如果组件已经卸载，不处理返回数据
        if (this.isUnmounted) return
        
        // demo数据格式统一为，成功返回data，失败返回error
        if (res.data) {
          this.setState({ status: SUCCESS, data: res.data })
        } else {
          this.setState({ status: FAILURE, message: res.error })
        }
      }).catch((e) => {
        if (this.isUnmounted) return
        this.setState({ status: FAILURE, message: e.message })
      })
    }

    render() {
      const { status, data } = this.state

      // 状态为成功，返回组件，并且传入data
      if (status === SUCCESS) {
        return <Origin {...this.props} data={data} fetchData={this.fetchData} />
      }

      // 加载中，返回一个动态的加载中
      if (status === PENDING) {
        return (
          <div style={{ position: 'relative' }}>
            <Mask >
              <Spin size={40} type="simple-circle" />
            </Mask>
          </div>
        )
      }

      // 处理失败信息
      if (status === FAILURE) {
        return <div>{this.state.message}</div>
      }
      return null
    }
  }

  Fetch.propTypes = {
    fetch: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ])
  }
  Fetch.defaultProps = {
    fetch: null
  }

  return Fetch
}
```
修改之前的src/components/author/List.js，移除了state相关的代码，变成了一个纯粹展示的组件，所以直接写成一个函数

```
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Card } from 'rctui'
import fetch from '_/hoc/fetch'

function List(props) {
  const { data } = props
  return (
    <Card>
      <Card.Header>作者列表</Card.Header>
      <Table
        data={data.list}
        columns={[
          { name: 'id', header: 'ID' },
          { name: 'name', header: '姓名', sort: true },
          { name: 'nationality', header: '国籍' },
          { name: 'birthday', header: '生日', sort: true },
        ]}
      />
    </Card>
  )
}

List.propTypes = {
  data: PropTypes.object.isRequired,
}

export default fetch(List)
```

src/components/author/index.js 也要稍作修改

```
  render() {
    const { match } = this.props

    return (
      <div>
        <Route
          exact
          path={`${match.url}`}
          {/* 这里加了fetch的属性 */}
          render={() => <List fetch={{ url: '/authorlist.json' }} />}
        />
      </div>
    )
  }
```

完整代码

```
$ git checkout step-7
```

## 加入mock数据
前面用了一个json文件来模拟数据，通常可以使用mock.js或者faker.js来模拟数据。这里再加一点私货，用一个我之前写的系统qenya，[项目地址在这里](https://github.com/Lobos/qenya)。暂时还有一些功能待补全，文档也还没有写，不过这里可以拿来mock数据。

首先，安装一下

```
$ npm install qenya --save
```
在server下面加入启动代码

```
const qenya = require('qenya')

// qenya 会启动两个服务，一个是数据管理平台，可以设置数据表和api
// 另一个是api服务，通过在数据管理平台配置的api访问
qenya({
  appPort: 3002,
  apiPort: 3003,
  render: function (res) {
    if (res.data) {
      return res.data
    } else {
      return {
        error: res.errors[0].message
      }
    }
  }
})

// api请求跳转到api服务器
router.get('/api/*', async function (ctx) {
  ctx.redirect(`http://localhost:3003${ctx.path}`)
})
```

qenya会在项目下面创建一个data文件夹，数据会保存在里面。
这里暂时忽略这些配置，只要知道有接口就好。如果感兴趣，可以checkout代码，访问localhost:3002 看下api配置，后面我会慢慢完善文档。

```
$ git checkout step-8
```

## CRUD
checkout代码，已经在后台配置好了四个数据接口，用来模拟服务端

```
get      /api/authorlist  获取列表数据
get      /api/author/:id  根据id获取单条记录
post     /api/author      添加或编辑数据
delete   /api/author      删除一条数据
```

新增 src/components/author/Edit.js 文件

```
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Form, FormControl, Message, Button } from 'rctui'
import refetch from 'refetch'
import fetch from '_/hoc/fetch'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleSubmit(data) {
    refetch.post('/api/author', data).then((res) => {
      if (res.data) {
        this.props.history.push('/author')
        Message.success('保存成功')
      } else {
        Message.error(res.error)
      }
    })
  }

  handleCancel() {
    this.props.history.goBack()
  }

  render() {
    const { data } = this.props

    return (
      <Card>
        <Card.Header>作者编辑</Card.Header>

        <div style={{ padding: 20 }}>
          <Form data={data} onSubmit={this.handleSubmit} >
            <FormControl label="姓名" name="name" grid={1 / 3} type="text" required min={2} max={20} />
            <FormControl label="生日" name="birthday" type="date" required />
            <FormControl label="国籍" name="nationality" type="text" />
            <FormControl>
              <Button type="submit" status="primary">提交</Button>
              <Button onClick={this.handleCancel}>取消</Button>
            </FormControl>
          </Form>
        </div>
      </Card>
    )
  }
}

Edit.propTypes = {
  data: PropTypes.object,
  history: PropTypes.object.isRequired,
}

Edit.defaultProps = {
  data: {},
}

// 使用之前的高阶组件fetch来获取数据
export default fetch(Edit)
```

修改 src/components/author/index.js 文件，加入路由

```
import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import List from './List'
import Edit from './Edit'

function Author(props) {
  const { url } = props.match

  return (
    <Switch>
      {/* 新增作者，不需要fetch data */}
      <Route path={`${url}/new`} component={Edit} />
      {/* 编辑作者，使用fetch获取数据 */}
      <Route
        path={`${url}/edit/:id`}
        render={
          ({ history, match }) => <Edit history={history} fetch={{ url: `/api/author/${match.params.id}` }} />
        }
      />
      {/* 列表，因为加入了分页，数据处理放到了List里面 */}
      <Route path={`${url}`} component={List} />
    </Switch>
  )
}

Author.propTypes = {
  match: PropTypes.object.isRequired,
}

export default Author
```

修改 src/components/author/List.js 文件，因为加入分页功能，拆分了这个页面

```
import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button } from 'rctui'
import queryString from 'query-string'
import TableList from './TableList'

function List(props) {
  const { history } = props

  // 从queryString中获取分页信息，格式为 ?page=x&size=x
  const query = queryString.parse(history.location.search)
  // 每页数据数量
  if (!query.size) query.size = 10

  return (
    <Card>
      <Card.Header>作者列表</Card.Header>
      <div style={{ padding: 12 }}>
        <Button status="success" onClick={() => history.push('/author/new')}>添加作者</Button>
      </div>

      <TableList
        history={history}
        fetch={{ url: '/api/authorlist', data: query }}
      />
    </Card>
  )
}

List.propTypes = {
  history: PropTypes.object.isRequired,
}

export default List

```

src/components/author/TableList.js 代码

```
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table, Pagination } from 'rctui'
import fetch from '_/hoc/fetch'
import DelButton from './DelButton'

function TableList(props) {
  const { data, history, fetchData } = props
  return (
    <div>
      <Table
        data={data.list}
        columns={[
          { name: 'id', width: '60px', header: 'ID' },
          { name: 'name', header: '姓名' },
          { name: 'nationality', header: '国籍' },
          { name: 'birthday', header: '生日' },
          {
            width: '120px',
            content: d => (
              <span>
                <Link to={`/author/edit/${d.id}`}>编辑</Link>
                {' '}
                <DelButton onSuccess={fetchData} data={d} />
              </span>
            ),
          },
        ]}
      />
      <div style={{ textAlign: 'center' }}>
        <Pagination
          page={data.page} size={data.size} total={data.total}
          onChange={page => history.push(`/author?page=${page}`)}
        />
      </div>
    </div>
  )
}

TableList.propTypes = {
  data: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

export default fetch(TableList)

```

可以看到，通过react-router和高阶组件fetch，我们把author下面的所有组件（列表、分页、编辑）都变成了无状态的组件。每个组件只关心route提供了什么参数，应该怎样去展示，当需要变化的时候，history.push到相应的route就行了。

完整代码

```
$ git checkout step-9
```

## Redux
接下来写分类管理，这次我们使用redux来处理。首先，仍然是安装包

```
$ npm install redux react-redux redux-thunk --save
```

数据结构非常简单

```
{
  "id": "8",
  "name": "科学幻想",
  "desc": "简称科幻，是虚构作品的一种类型，描述诸如未来科技、时间旅行、超光速旅行、平行宇宙、外星生命、人工智能、错置历史等有关科学的想象性内容。"
}
```

同样的，有3个后端接口


```
get      /api/genres     获取列表数据
post     /api/genre      添加或编辑数据
delete   /api/genre      删除一条数据
```

之前随手写了一个category占位，这里统一改成genre。

先在src下面建一个文件夹 src/actions，用来存放 redux 的 actions。这里做了一些简化，一次从服务端拉取所有数据存在store中，没有考虑分页的问题。也没有单条数据的请求，编辑时直接从list里面获取了。

src/actions/genre.js

```
import { Message } from 'rctui'
import refetch from 'refetch'

export const GENRE_LIST = 'GENRE_LIST'
function handleList(status, data, message) {
  return {
    type: GENRE_LIST,
    status,
    data,
    message,
  }
}

// 从服务端获取数据
function fetchList() {
  return (dispatch) => {
    dispatch(handleList(0))
    refetch.get('/api/genres', { size: 999 }).then((res) => {
      if (res.data) {
        dispatch(handleList(1, res.data.list))
      } else {
        dispatch(handleList(2, null, res.error))
      }
    }).catch((err) => {
      dispatch(handleList(2, null, err.message))
    })
  }
}

// 对外获取列表的接口
export function getGenreList() {
  return (dispatch, getState) => {
    const { data, status } = getState().genre
    
    // 如果数据已存在，直接返回
    if (status === 1 && data && data.length > 0) {
      return Promise.resolve()
    }
    
    return dispatch(fetchList())
  }
}

// 保存数据接口
export function saveGenre(body, onSuccess) {
  return (dispatch, getState) => {
    refetch.post('/api/genre', body, { dataType: 'json' }).then((res) => {
      if (res.data) {
        onSuccess()
        
        // 如果是修改，从数组里把原数据剔除
        const data = getState().genre.data.filter(d => d.id !== res.data.id)
        
        data.unshift(res.data)
        dispatch(handleList(1, data))
        
        Message.success('保存成功')
      } else {
        Message.error(res.error)
      }
    }).catch((err) => {
      Message.error(err.message)
    })
  }
}

// 删除数据接口
export function removeGenre(id) {
  return (dispatch, getState) => {
    refetch.delete('/api/genre', { id }).then((res) => {
      if (res.data === 1) {
        Message.success('删除成功')
        
        // 删除直接从store的列表里剔除数据，不再发请求到服务端
        const data = getState().genre.data.filter(d => d.id !== id)
        
        dispatch(handleList(1, data))
      }
    }).catch((err) => {
      Message.error(err.message)
    })
  }
}

```

接下来增加一个 src/reducers/genre.js，这个比较简单，只有一个 action type

```
import { GENRE_LIST } from '_/actions/genre'

export default function (state = {
  status: 0,
  data: undefined,
}, action) {
  switch (action.type) {
    case GENRE_LIST:
      return Object.assign({}, state, {
        status: action.status,
        data: action.data,
        message: action.message,
      })
    default:
      return state
  }
}

```

虽然只有一个reducer，为了掩饰结构，还是建一个 src/reducers/index.js 文件

```
import { combineReducers } from 'redux'
import genre from './genre'

export default combineReducers({
  genre,
})

```

接下来是 src/store.js，这里使用 redux-thunk 来处理异步数据

```
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

const store = createStoreWithMiddleware(reducer)

export default store

```

最后，把 store 注入到 App，修改 src/index.js

```
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))

module.hot && module.hot.accept()
```

现在可以开始写 genre 的代码了

src/components/genre/index.js

```
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getGenreList } from '_/actions/genre'
import { Route, Switch } from 'react-router-dom'
import Loading from '_/components/comm/Loading'
import List from './List'
import Edit from './Edit'

class Genre extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.renderEdit = this.renderEdit.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(getGenreList())
  }

  renderEdit({ history, match }) {
    const { genre } = this.props
    
    // 这里没有从服务端获取，而是从list里面获取的单条数据
    const data = genre.data.find(d => d.id === match.params.id)

    return <Edit history={history} data={data} />
  }

  render() {
    const { genre, history, match } = this.props
    const { url } = match

    // 当没有数据的时候展示一个 Loading
    if (genre.status === 0) {
      return <Loading height={300} />
    }

    if (genre.status === 2) {
      return <div>{genre.message}</div>
    }

    // 和 author 一样，都是三条路由，只是数据已经从props里拿到，这里直接传入
    return (
      <Switch>
        <Route path={`${url}/new`} component={Edit} />
        <Route path={`${url}/edit/:id`} render={this.renderEdit} />
        <Route
          path={`${url}`}
          render={() => <List history={history} data={genre.data} />}
        />
      </Switch>
    )
  }
}

Genre.propTypes = {
  dispatch: PropTypes.func.isRequired,
  genre: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  const { genre } = state
  return { genre }
}

export default connect(mapStateToProps)(Genre)

```

src/components/genre/List.js

```
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Card, Table, Button } from 'rctui'
import DelButton from './DelButton'

function List(props) {
  const { data, history } = props
  return (
    <Card>
      <Card.Header>类型列表</Card.Header>

      <div style={{ padding: 12 }}>
        <Button status="success" onClick={() => history.push('/genre/new')}>添加类型</Button>
      </div>

      <Table
        data={data}
        columns={[
          {
            name: 'id',
            width: 100,
            header: 'ID',
            sort: [
              (a, b) => parseInt(a.id, 10) > parseInt(b.id, 10) ? 1 : -1,
              (a, b) => parseInt(a.id, 10) < parseInt(b.id, 10) ? 1 : -1,
            ],
          },
          { name: 'name', width: 160, header: '名称', sort: true },
          { name: 'desc', header: '简介' },
          {
            width: '120px',
            content: d => (
              <span>
                <Link to={`/genre/edit/${d.id}`}>编辑</Link>
                {' '}
                <DelButton data={d} />
              </span>
            ),
          },
        ]}
        {/* 因为拿到的是全部的数据，这里使用了Table内置的分页 */}
        pagination={{ size: 10, position: 'center' }}
      />
    </Card>
  )
}

List.propTypes = {
  data: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
}

export default List

```

src/components/genre/Edit.js

```
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Form, FormControl, Button } from 'rctui'
import { saveGenre } from '_/actions/genre'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleSubmit(data) {
    // 这里调用了 actions 里的方法
    this.props.dispatch(saveGenre(data, this.props.history.goBack))
  }

  handleCancel() {
    this.props.history.goBack()
  }

  render() {
    const { data } = this.props

    return (
      <Card>
        <Card.Header>类型编辑</Card.Header>

        <div style={{ padding: 20 }}>
          <Form data={data} style={{ width: 700 }} onSubmit={this.handleSubmit} >
            <FormControl label="名称" name="name" grid={1 / 3} type="text" required min={2} max={20} />
            <FormControl label="简介" name="desc" type="textarea" max={200} />
            <FormControl>
              <Button type="submit" status="primary">提交</Button>
              <Button onClick={this.handleCancel}>取消</Button>
            </FormControl>
          </Form>
        </div>
      </Card>
    )
  }
}

Edit.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

Edit.defaultProps = {
  data: {},
}

export default connect()(Edit)
```

对比一下author的示例，使用redux之后，实际是要复杂很多的，如果加上分页，会更加复杂一些。修改代码的时候，很可能需要在action，reducer，component的代码里找一圈。并且要时刻关心store里面的数据，比如一条数据更新或者删除了，列表里的数据也要及时更新，后期的维护成本会比较高一些。当然，优点也是显而易见的，代码结构比较清晰，任意的跨组件通信，服务端请求次数减少。

个人认为，除了一些全局的数据，比如用户登陆信息，权限等等，可以放在redux里维护之外，和业务相关的大部分列表页，详情页等数据，都可以使用state维护，用完就丢，可以减少很多维护成本。

完整代码

```
$ git checkout step-10
```

## 在弹出层中编辑

书籍这里，换一个不一样的交互方式吧，列表改为card，编辑改为弹出层。

数据结构

```
{
  "id": "17",
  "title": "沉默的大多数",
  "author": "1",
  "genres": "1,2",
  "publishAt": "1997-01",
  "cover": "https://img1.doubanio.com/lpic/s1447349.jpg",
  "desc": ""
}
```

src/components/book/index.js，采用弹出层的设计，所以这里不再需要子路由

```
import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'rctui'
import queryString from 'query-string'
import List from './List'

function Book(props) {
  const { history } = props

  const query = queryString.parse(history.location.search)
  if (!query.size) query.size = 12

  return (
    <Card>
      <Card.Header>书籍管理</Card.Header>

      <List history={history} fetch={{ url: '/api/booklist', data: query }} />
    </Card>
  )
}

Book.propTypes = {
  history: PropTypes.object.isRequired,
}

export default Book
```

src/components/book/List.js

```
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Media, Image, Button, Modal, Pagination } from 'rctui'
import { getGenreList } from '_/actions/genre'
import fetch from '_/hoc/fetch'
import Edit from './Edit'

class List extends Component {
  componentDidMount() {
    this.props.dispatch(getGenreList())
  }

  handleEdit(book) {
    // 这里从store里获取类别，传递给Edit使用
    const { genres } = this.props

    const fc = book ? { url: `/api/book/${book.id}` } : undefined

    const mid = Modal.open({
      header: '书籍编辑',
      width: 800,
      content: (
        <Edit
          genres={genres}
          fetch={fc}
          onSuccess={() => {
            this.props.fetchData()
            Modal.close(mid)
          }}
        />
      ),
      buttons: {
        提交: 'submit',
        取消: true,
      },
    })
  }

  render() {
    const { data, history } = this.props
    return (
      <div>
        <div style={{ padding: 20 }}>
          <Button status="success" onClick={() => this.handleEdit(null)}>添加书籍</Button>
        </div>

        {data.list.map(d => (
          <div key={d.id}>
            <Media>
              <Media.Left>
                <Image src={d.cover} width={100} height={150} type="fill" />
              </Media.Left>
              <Media.Body style={{ fontSize: 12, paddingLeft: 10, color: '#666' }}>
                <h4 style={{ fontSize: 18, marginBottom: 16 }}>{d.title}</h4>
                <div>作者：{d.author}</div>
                <div>出版时间：{d.publishAt}</div>
                <div>类型：{d.genres}</div>
                <Button
                  style={{ position: 'absolute', right: 0, bottom: 0, fontSize: 12 }}
                  status="link"
                  onClick={() => this.handleEdit(d)}
                >编辑</Button>
              </Media.Body>
            </Media>
          </div>
        ))}

        <div style={{ textAlign: 'center' }}>
          <Pagination
            page={data.page} size={data.size} total={data.total}
            onChange={page => history.push(`/book?page=${page}`)}
          />
        </div>
      </div>
    )
  }
}

List.propTypes = {
  data: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  genres: PropTypes.array,
  history: PropTypes.object.isRequired,
}

List.defaultProps = {
  genres: [],
}

const mapStateToProps = (state) => {
  const { genre } = state
  return { genres: genre.data }
}

export default fetch(connect(mapStateToProps)(List))

```

src/components/book/Edit.js

```
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, FormControl, Message } from 'rctui'
import fetch from '_/hoc/fetch'
import refetch from 'refetch'

class Edit extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(data) {
    refetch.post('/api/book', data).then((res) => {
      if (res.data) {
        this.props.onSuccess()
        Message.success('保存成功')
      } else {
        Message.error(res.error)
      }
    })
  }

  render() {
    const { data, genres } = this.props

    return (
      <Form data={data} onSubmit={this.handleSubmit}>
        <FormControl label="书名" name="title" grid={1 / 2} type="text" required min={2} max={20} />

        <FormControl
          label="作者" name="author" type="select" required grid={1 / 3}
          fetch={{ url: '/api/authorlist?size=999', then: res => res.data.list }}
          valueTpl="{id}" optionTpl="{name}"
        />

        <FormControl label="出版时间" type="text" name="publishAt" grid={1 / 2} />

        <FormControl label="封面图片" type="text" name="cover" grid={7 / 8} />

        <FormControl
          label="类别" type="checkbox-group" name="genres"
          data={genres} valueTpl="{id}" textTpl="{name}"
        />

        <FormControl label="简介" type="textarea" rows={3} name="desc" grid={7 / 8} />
      </Form>
    )
  }
}

Edit.propTypes = {
  data: PropTypes.object,
  genres: PropTypes.array.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

Edit.defaultProps = {
  data: {},
}

export default fetch(Edit)
```

完整代码

```
$ git checkout step-11
```

## 项目结构
最后说下项目结构吧，可能不是最好的，不过算是我做了一些项目下来比较顺手的。

```
|- build/   生产代码，发布到cdn的
|- demo/    放一些本地开发需要用到的文件，html，第三方库等等
|- src/     源代码目录
|   |- actions/     redux actions 目录
|   |- components/  对于SPA应用，个人习惯把所有组件都放在这个目录下
|   |- hoc/         高阶组件目录
|   |- reducers/    redux reducer 目录
|   |- styles/      个人习惯把样式文件统一起来管理，因为可能会有一些全局的变量文件，
					 实际上文件并不多，如果不是复用的样式或者是伪类，都直接写在组件上
|   |- utils/       一些工具类的文件
|   |- App.js       项目框架文件
|   |- index.js     项目入口文件
|   |- store.js
|- .eslintrc        eslint 配置文件
|- .npmrc           这个文件可以放在全局，不过我的机器上有些项目在内网，所以习惯放在项目下面单独管理
|- server.js        开发服务器
|- webpack.dev.config.js  开发时用的webpack配置
|- webpack.config.js      发布时用的配置
```