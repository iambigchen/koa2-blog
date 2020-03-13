/**
 * @description user service
 */

const { User } = require('../db/model/index')
const {formatUser} = require('./_format')
const {addFollower} = require('./user-relation')
/**
 * 获取用户信息
 * @param {string} userName 用户名
 * @param {string} password 密码
 */
async function getUserInfo(userName, password) {
  const where = {
    userName
  }
  if (password) {
    Object.assign(where, {password})
  }

  const result = await User.findOne({
    attributes: ['id', 'userName', 'nickName', 'picture', 'city'],
    where
  })

  if (result == null) {
    // 未找到
    return result
  }
  // 格式化
  const formatRes = formatUser(result.dataValues)
  return formatRes
}

/**
 * 创建用户
 * @param {object} param0 userName 用户名 password 密码 gender 性别(1 男 2 女 3 保密） nickName 昵称
 */
async function createUser({ userName, password, gender = 3, nickName }) {
  const crreateResult = await User.create({
    userName,
    password,
    nickName: nickName ? nickName : userName,
    gender
  })
  const data = crreateResult.dataValues

  // 自己关注自己（为了方便首页获取数据）
  addFollower(data.id, data.id)

  return data
}

/**
 * 更新用户信息
 * @param {*} param0 要修改的内容
 * @param {*} param1 查询条件
 */
async function updateUser(
  { newPassword, newNickName, newPicture, newCity },
  { userName, password }
) {
  // 拼接修改内容
  const updateData = {}
  if (newPassword) {
      updateData.password = newPassword
  }
  if (newNickName) {
      updateData.nickName = newNickName
  }
  if (newPicture) {
      updateData.picture = newPicture
  }
  if (newCity) {
      updateData.city = newCity
  }
  // 拼接查询条件
  const whereData = {
    userName
  }
  if (password) {
      whereData.password = password
  }
  const result = await User.update(updateData, {
    where: whereData
  })
  return result[0] > 0 // 修改的行数
}

module.exports = {
  createUser,
  getUserInfo,
  updateUser
}
