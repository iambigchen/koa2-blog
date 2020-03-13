/**
 * @description error 404 路由
 * @author cy
 */

 const router = require('koa-router')()

 // 404
router.get('*', async (ctx, next) => {
  await ctx.render('404')
})

 module.exports = router
