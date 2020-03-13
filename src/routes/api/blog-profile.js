/**
 * @description profile api router
 * @author cy
 */

const router = require('koa-router')()
const {follow, unFollow} = require('../../controller/user-relation')
const {loginCheck} = require('../../middlewares/logincheck')

router.prefix('/api/profile')

// 关注
router.post('/follow', loginCheck, async (ctx, next) => {
  const {id: myUserId} = ctx.session.userInfo
  const {userId: curUserId} = ctx.request.body
  ctx.body = await follow(myUserId, curUserId)
})

// 取消关注
router.post('/unFollow', loginCheck, async (ctx, next) => {
  const {id: myUserId} = ctx.session.userInfo
  const {userId: curUserId} = ctx.request.body
  ctx.body = await unFollow(myUserId, curUserId)
})

module.exports = router
