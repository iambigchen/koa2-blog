/*
 * @Author: chenyu
 * @Date: 2020-03-10 10:19:00
 * @Last Modified by: chenyu
 * @Last Modified time: 2020-03-16 11:58:42
 */
/**
 * @description user API 路由
 * @author cy
 */

const router = require('koa-router')()
const {register, isExist, login, changeInfo, changePassword, logout, deleteCurUser} = require('../../controller/user')
const userValidate = require('../../validator/user')
const {genValidator} = require('../../middlewares/validator')
const {loginCheck} = require('../../middlewares/logincheck')
const {getFollowers} = require('../../controller/user-relation')
const {isTest} = require('../../utils/env')
router.prefix('/api/user')

// 用户是否存在
router.post('/isExist', async (ctx, next) => {
  const {userName} = ctx.request.body
  ctx.body = await isExist(userName)
})

// 注册
router.post('/register', genValidator(userValidate), async (ctx, next) => {
  const {userName, password, gender} = ctx.request.body
  ctx.body = await register({userName, password, gender})
})

// 登录
router.post('/login', async (ctx, next) => {
  const {userName, password} = ctx.request.body
  ctx.body = await login(ctx, userName, password)
})

// 修改用户信息
router.patch('/changeInfo', loginCheck, genValidator(userValidate), async (ctx, next) => {
  const { nickName, city, picture } = ctx.request.body
  ctx.body = await changeInfo(ctx, { nickName, city, picture })
})

//修改密码
router.patch('/changePassword', loginCheck, genValidator(userValidate), async (ctx, next) => {
  const { userName } = ctx.session.userInfo
  const { password, newPassword } = ctx.request.body
  ctx.body = await changePassword(userName, password, newPassword)
})

// 退出登录
router.post('/logout', loginCheck, async (ctx, next) => {
  ctx.body = await logout(ctx)
})

// 获取@列表
router.get('/getAtList', loginCheck, async (ctx, next) => {
  const { id: userId } = ctx.session.userInfo
  const result = await getFollowers(userId)
  const { userList: followersList } = result.data
  const list = followersList.map(user => {
      return `${user.nickName} - ${user.userName}`
  })
  ctx.body = list
})

// 删除用户
router.post('/delete', loginCheck, async (ctx, next) => {
  if (isTest) {
    const { userName } = ctx.session.userInfo
    const result = await deleteCurUser(userName)
    ctx.body = result
  }
})
module.exports = router
