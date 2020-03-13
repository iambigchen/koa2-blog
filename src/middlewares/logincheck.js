/**
 * @description 是否登录中间件
 * @author cy
 */
const {ErrorModel} = require('../models/ResModel')
const { loginCheckFailInfo } = require('../models/ErrorInfo')

/**
 * api登录验证
 * @param {*} ctx
 * @param {*} next
 */
async function loginCheck(ctx, next) {
  if (ctx.session && ctx.session.userInfo) {
    // 已登录
    await next()
    return
  }
  // 未登录
  return ctx.body = new ErrorModel(loginCheckFailInfo)
}

async function loginRedirect(ctx, next) {
  if (ctx.session && ctx.session.userInfo) {
    // 已登录
    await next()
    return
  }
  // 未登录
  const curUrl = ctx.url
  ctx.redirect('/login?url=' + encodeURIComponent(curUrl))
}

module.exports = {
  loginCheck,
  loginRedirect
}
