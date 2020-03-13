/**
 * @description blog view router
 * @author cy
 */
const router = require('koa-router')()
const {loginRedirect} = require('../../middlewares/logincheck')
const {getHomeBlogList} = require('../../controller/blog-home')
const {getProfileBlogList} = require('../../controller/blog-profile')
const {getFollowers, getFans} = require('../../controller/user-relation')
const {isExist} = require('../../controller/user')
const {getSquareBlogList} = require('../../controller/blog-square')
const {getAtMeCount, getAtMeBlogList, markAsRead} = require('../../controller/blog-at')
// 首页
router.get('/', loginRedirect, async (ctx, next) => {
  const userInfo = ctx.session.userInfo
  const {id: userId} = userInfo

  // 获取博客数据
  const blogResult = await getHomeBlogList(userId)

  // 获取粉丝
  const fansResult = await getFans(userId)
  const { count: fansCount, userList: fansList } = fansResult.data

  // 获取关注人列表
  const followersResult = await getFollowers(userId)
  const { count: followersCount, userList: followersList } = followersResult.data

  // 获取@数量
  const {data: atCount} = await getAtMeCount(userId)
  await ctx.render('index', {
    blogData: blogResult.data,
    userData: {
      userInfo,
      fansData: {
          count: fansCount,
          list: fansList
      },
      followersData: {
          count: followersCount,
          list: followersList
      },
      atCount
    }
  })
})

// 个人主页
router.get('/profile', loginRedirect, async (ctx, next) => {
  const { userName } = ctx.session.userInfo
  ctx.redirect(`/profile/${userName}`)
})

router.get('/profile/:userName', loginRedirect, async (ctx, next) => {
  // 已登录用户的信息
  const myUserInfo = ctx.session.userInfo
  const myUserName = myUserInfo.userName

  let curUserInfo
  const { userName: curUserName } = ctx.params
  const isMe = myUserName === curUserName

  if (isMe) {
    // 是当前登录用户
    curUserInfo = myUserInfo
  } else {
      // 不是当前登录用户
      const existResult = await isExist(curUserName)
      if (existResult.errno !== 0) {
          // 用户名不存在
          return
      }
      // 用户名存在
      curUserInfo = existResult.data
  }
  // 获取微博第一页数据
  const result = await getProfileBlogList(curUserName, 0)
  const { isEmpty, blogList, pageSize, pageIndex, count } = result.data

  // 获取关注人列表
  const followersResult = await getFollowers(curUserInfo.id)
  const { count: followersCount, userList: followersList } = followersResult.data

  // 获取fans列表
  const fansResult = await getFans(curUserInfo.id)
  const { count: fansCount, userList: fanssList } = fansResult.data

  // 我是否关注了此人？
  const amIFollowed = fanssList.some(item => {
    return item.userName === myUserName
  })

  // 获取 @ 数量
  const atCountResult = await getAtMeCount(myUserInfo.id)
  const atCount = atCountResult.data

  await ctx.render('profile', {
    blogData: {
      isEmpty,
      blogList,
      pageSize,
      pageIndex,
      count
    },
    userData: {
      userInfo: curUserInfo,
      isMe,
      followersData: {
        count: followersCount,
        list: followersList
      },
      fansData: {
        count: fansCount,
        list: fanssList
      },
      amIFollowed,
      atCount
    }
  })
})

// 广场页路由
router.get('/square', loginRedirect, async (ctx, next) => {
  // 获取微博数据，第一页
  const result = await getSquareBlogList(0)
  const { isEmpty, blogList, pageSize, pageIndex, count } = result.data || {}

  await ctx.render('square', {
    blogData: {
      isEmpty,
      blogList,
      pageSize,
      pageIndex,
      count
    }
  })
})

// @页
router.get('/at-me', loginRedirect, async (ctx,next) => {
  const {id: userId} = ctx.session.userInfo

  // 获取 @ 数量
  const atCountResult = await getAtMeCount(userId)
  const atCount = atCountResult.data

  // 获取第一页列表
  const result = await getAtMeBlogList(userId)
  const { isEmpty, blogList, pageSize, pageIndex, count } = result.data

  // 渲染页面
  await ctx.render('atMe', {
      atCount,
      blogData: {
          isEmpty,
          blogList,
          pageSize,
          pageIndex,
          count
      }
  })

  // 标记为已读
  if (atCount > 0) {
    await markAsRead(userId)
  }
})
module.exports = router
