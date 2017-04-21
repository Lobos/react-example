const Koa = require('koa')
const send = require('koa-send')
const Router = require('koa-router')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.dev.config')

const qenya = require('qenya')

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

const app = new Koa()
const router = new Router()

router.get('/', async function (ctx) {
  await send(ctx, 'demo/index.html')
})

router.get('/api/*', async function (ctx) {
  ctx.redirect(`http://localhost:3003${ctx.path}`)
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
  ctx.redirect(`http://localhost:${DEVPORT}/${ctx.path}`)
})

app.use(router.routes())

app.listen(3000, function () {
  console.log('server running on http://localhost:3000')
})