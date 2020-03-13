/**
 * @description @ controller
 * @author cy
 */
const {getAtRelationCount, getAtUserBlogList, updateAtRelation} = require('../services/at-relation')
const {SuccessModel, ErrorModel} = require('../models/ResModel')
const PAGE_SIZE = 5
/**
 * 获取@数量
 * @param {string} userId 用户id
 */
async function getAtMeCount(userId) {
  const count = await getAtRelationCount(userId)
  return new SuccessModel(count)
}

/**
 * 获取@博客列表
 * @param {string} userId 用户id
 */
async function getAtMeBlogList(userId, pageIndex = 0) {
  const result = await getAtUserBlogList({userId,
    pageIndex,
    pageSize: PAGE_SIZE})
  const { count, blogList } = result

   // 返回
   return new SuccessModel({
    isEmpty: blogList.length === 0,
    blogList,
    pageSize: PAGE_SIZE,
    pageIndex,
    count
  })
}

/**
 * 清除未读
 * @param {string} userId 用户id
 */
async function markAsRead(userId) {
  try {
    await updateAtRelation(
        { newIsRead: true },
        { userId, isRead: false }
    )
  } catch (ex) {
      console.error(ex)
  }
}
module.exports = {
  getAtMeCount,
  getAtMeBlogList,
  markAsRead
}
