const request = require('request')
const Koa = require('koa')
const send = require('koa-send')
const Router = require('koa-router')
const body = require('koa-bodyparser')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.dev.config')

const qenya = require('qenya')
const DEVPORT = 3001

// mock data server ========================================
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

// webpack server ===========================================

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

// dev server ================================================
const app = new Koa()
const router = new Router()

const methods = ['get', 'post', 'put', 'delete']
methods.forEach(m => 
  router[m]('/api/*', body(), function (ctx) {
    const options = {
      uri: `http://localhost:3003${ctx.url}`,
      mothed: m,
    }
    if (m === 'get') {
      ctx.body = request(options)
    } else {
      ctx.body = request[m](options).form(ctx.request.body)
    }
  })
)

router.get('/', async function (ctx) {
  await send(ctx, 'demo/index.html')
})

// 线上会使用压缩版本的React，而在开发的时候，我们需要使用react-with-addons来查看错误信息
// 所以这里把React和ReactDOM代理到本地未压缩的文件
router.get('**/react.min.js', async function (ctx) {
  await send(ctx, 'demo/react-with-addons.js')
})
router.get('**/react-dom.min.js', async function (ctx) {
  await send(ctx, 'demo/react-dom.js')
})

router.get('**/*.js(on)?', async function (ctx) {
  const options = {
    uri: `http://localhost:${DEVPORT}/${ctx.url}`,
    mothed: 'GET',
  }
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.body = request(options)
})

app.use(router.routes())

app.listen(3000, function () {
  console.log('server running on http://localhost:3000')
})