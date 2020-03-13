/**
 * @description blog api router
 * @author cy
 */
const xss = require('xss')
const {createBlog, getFollowersBlogList} = require('../services/blog')
const {getUserInfo} = require('../services/user')
const {SuccessModel, ErrorModel} = require('../models/ResModel')
const {createBlogFailInfo} = require('../models/ErrorInfo')
const REG_FOR_AT_WHO = /@(.+?)\s-\s(.+?)\b/g
const {createAtRelation} = require('../services/at-relation')
/**
 * 获取博客列表
 * @param {number} userId 用户id
 * @param {number} pageIndex 页数
 */
async function getHomeBlogList(userId, pageIndex = 0) {
  const result = await getFollowersBlogList({
    userId,
    pageIndex,
    pageSize: 5
  })

  const { count, blogList } = result
  return new SuccessModel({
    count,
    blogList,
    pageSize: 5,
    pageIndex,
    isEmpty: blogList.length === 0
  })
}

/**
 * 创建博客
 * @param {*} param0
 */
async function create({ userId, content, image }) {
  const atUserNameList = []
  content.replace(REG_FOR_AT_WHO, (matchStr, nikeName, userName) => {
    atUserNameList.push(userName)
    return matchStr // 替换不生效，预期
  })

  const atUserList = await Promise.all(atUserNameList.map(userName => getUserInfo(userName)))
  // 根据用户信息，获取用户 id
  const atUserIdList = atUserList.map(user => user.id)

  try {
    // 创建微博
    const blog = await createBlog({
        userId,
        content: xss(content),
        image
    })

    // 创建 @ 关系
    await Promise.all(atUserIdList.map(
        userId => createAtRelation(blog.id, userId)
    ))

    // 返回
    return new SuccessModel(blog)
  } catch (ex) {
      console.error(ex.message, ex.stack)
      return new ErrorModel(createBlogFailInfo)
  }
}

module.exports = {
  getHomeBlogList,
  create
}
