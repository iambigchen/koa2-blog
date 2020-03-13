/**
 * @description 用户关系 controller
 * @author cy
 */

const {addFollower, getFollowersByUser, getUsersByFollower, deleteFollower} = require('../services/user-relation')
const {SuccessModel, ErrorModel} = require('../models/ResModel')
const { addFollowerFailInfo, deleteFollowerFailInfo } = require('../models/ErrorInfo')

/**
 * 关注
 * @param {string} userId 当前人id
 * @param {string} followerId 被关注人id
 */
async function follow(userId, followerId) {
  try {
      await addFollower(userId, followerId)
      return new SuccessModel()
  } catch (ex) {
      console.error(ex)
      return new ErrorModel(addFollowerFailInfo)
  }
}

/**
 * 取消关注
 * @param {string} userId 当前人id
 * @param {string} followerId 被关注人id
 */
async function unFollow(userId, followerId) {
  try {
    await deleteFollower(userId, followerId)
    return new SuccessModel()
  } catch (ex) {
      console.error(ex)
      return new ErrorModel(deleteFollowerFailInfo)
  }
}

/**
 * 获取关注人列表
 * @param {string} userId 用户id
 */
async function getFollowers(userId) {
  const result = await getFollowersByUser(userId)
  return new SuccessModel(result)
}

/**
 * 获取粉丝列表
 * @param {string} followerId 用户id
 */
async function getFans(followerId) {
  const result = await getUsersByFollower(followerId)
  return new SuccessModel(result)
}

module.exports = {
  follow,
  getFollowers,
  unFollow,
  getFans
}
