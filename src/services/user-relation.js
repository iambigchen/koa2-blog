/**
 * @description 用户关系 services
 * @author cy
 */
const UserRelation = require('../db/model/UserRelation')
const User = require('../db/model/User')
const {formatUser} = require('./_format')
const Sequelize = require('Sequelize')

/**
 * 加关注
 * @param {string} userId 当前人id
 * @param {string} followerId 被关注人id
 */
async function addFollower(userId, followerId) {
  const result = await UserRelation.create({
    userId,
    followerId
  })
  return result.dataValues
}

/**
 * 删除关注关系
 * @param {string} userId 当前人id
 * @param {string} followerId 被关注人id
 */
async function deleteFollower(userId, followerId) {
  const result = await UserRelation.destroy({
    where: {
      userId,
      followerId
    }
  })
  return result.dataValues
}
/**
 * 根据用户id 获取关注人列表
 * @param {string} userId 用户id
 */
async function getFollowersByUser (userId) {
  const result = await UserRelation.findAndCountAll({
    order: [
      ['id', 'desc']
    ],
    include: {
      model: User,
      attributes: ['id', 'userName', 'nickName', 'picture']
    },
    where: {
      userId,
      followerId: {
        [Sequelize.Op.ne]: userId
      }
    }
  })

  let userList = result.rows.map(row => row.dataValues)
  userList = userList.map(item => {
    let user = item.user
    user = user.dataValues
    user = formatUser(user)
    return user
  })
  return {
    count: result.count,
    userList
  }
}

/**
 * 根据id获取粉丝列表
 * @param {string} followerId 用户id
 */
async function getUsersByFollower(followerId) {
  const result = await User.findAndCountAll({
    attributes: ['id', 'userName', 'nickName', 'picture'],
    order: [
      ['id', 'desc']
    ],
    include: {
      model: UserRelation,
      where: {
        followerId,
        userId: {
            [Sequelize.Op.ne]: followerId
        }
      }
    }
  })
  let userList = result.rows.map(row => row.dataValues)
  userList = formatUser(userList)
  return {
    count: result.count,
    userList
  }
}

module.exports = {
  addFollower,
  deleteFollower,
  getFollowersByUser,
  getUsersByFollower
}
