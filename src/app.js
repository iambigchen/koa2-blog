const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')
const redisStore = require('koa-redis')
const session = require('koa-generic-session')

const { REDIS_CONF } = require('./config/db')
const { SESSION_SECRET_KEY } = require('./config/secretKeys')

// router
const userViewRouter = require('./routes/view/user')
const blogViewRouter = require('./routes/view/blog')
const userAPIRouter = require('./routes/api/user')
const blogHomeAPIRouter = require('./routes/api/blog-home')
const utilsAPIRouter = require('./routes/api/utils')
const profileAPIRouter = require('./routes/api/blog-profile')
const errorRouter = require('./routes/view/error')

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(require('koa-static')(path.join(__dirname, '..', 'uploadFiles')))
  .use(views(path.join(__dirname, '/views'), {
    options: {settings: {views: path.join(__dirname, 'views')}},
    map: {'ejs': 'ejs'},
    extension: 'ejs'
  }))
  .use(router.routes())
  .use(router.allowedMethods())
// session处理
app.keys = [SESSION_SECRET_KEY]
app.use(session({
  key: 'weibo.sid', // cookie name 默认是 `koa.sid`
  prefix: 'weibo:sess:', // redis key 的前缀，默认是 `koa:sess:`
  cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000  // 单位 ms
  }//,
  // 配置 redis
  // store: redisStore({
  //   // all: 'localhost:6379'   // 写死本地的 redis
  //   all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  // })
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - $ms`)
// })

// router
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(blogViewRouter.routes(), blogViewRouter.allowedMethods())

app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods())
app.use(blogHomeAPIRouter.routes(), blogHomeAPIRouter.allowedMethods())
app.use(utilsAPIRouter.routes(), utilsAPIRouter.allowedMethods())
app.use(profileAPIRouter.routes(), profileAPIRouter.allowedMethods())
app.use(errorRouter.routes(), errorRouter.allowedMethods())

app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app
