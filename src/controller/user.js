/*
 * @Author: chenyu
 * @Date: 2020-03-11 16:27:50
 * @Last Modified by: chenyu
 * @Last Modified time: 2020-03-13 11:28:10
 */
/*
 * @Author: chenyu
 * @Date: 2020-03-11 15:10:17
 * @Last Modified by: chenyu
 * @Last Modified time: 2020-03-11 16:25:47
 */
/**
 * @description user controller
 * @author cy
 */
const {SuccessModel, ErrorModel} = require('../models/ResModel')
const {getUserInfo, createUser, updateUser} = require('../services/user')
const {registerFailInfo, registerUserNameExistInfo, registerUserNameNotExistInfo, loginFailInfo, changeInfoFailInfo} = require('../models/ErrorInfo')
const doCrypto = require('../utils/cryp')
/**
 * 注册
 * @param {Object} param0 userName password gender
 */
async function register({userName, password, gender}) {
  const userInfo = await getUserInfo(userName)
  if (userInfo) {
    return new ErrorModel(registerUserNameExistInfo)
  }

  try {
    await createUser({
      userName,
      password: doCrypto(password),
      gender
    })
    return new SuccessModel()
  } catch (error) {
    console.error(error.message, error.stack)
    return new ErrorModel(registerFailInfo)
  }
}

/**
 * 用户是否存在
 * @param {string} userName 用户名
 */
async function isExist(userName) {
  const userInfo = await getUserInfo(userName)
  if (userInfo) {
      // { errno: 0, data: {....} }
      return new SuccessModel(userInfo)
  } else {
      // { errno: 10003, message: '用户名未存在' }
      return new ErrorModel(registerUserNameNotExistInfo)
  }
}

/**
 * 登录
 * @param {string} userName 用户名
 * @param {string} password 密码
 */
async function login(ctx, userName, password) {
  const userInfo = await getUserInfo(userName, doCrypto(password))
  if (!userInfo) {
    // 登录失败
    return new ErrorModel(loginFailInfo)
  }
  // 登录成功
  var session = ctx.session
  if (!session.userInfo) {
    session.userInfo = userInfo
  }
  return new SuccessModel(userInfo)
}

/**
 * 修改用户信息
 * @param {*} ctx
 * @param {*} param1
 */
async function changeInfo(ctx, { nickName, city, picture }) {
  const { userName } = ctx.session.userInfo
  if (!nickName) {
      nickName = userName
  }
  const result = await updateUser(
    {
      newNickName: nickName,
      newCity: city,
      newPicture: picture
    },
    {
      userName
    }
  )
  if (result) {
    // 更新成功
    // 执行成功
    Object.assign(ctx.session.userInfo, {
        nickName,
        city,
        picture
    })
    // 返回
    return new SuccessModel()
  }
  // 更新失败
  return new ErrorModel(changeInfoFailInfo)
}

/**
 * 修改密码
 * @param {string} userName 用户名
 * @param {string} password 当前密码
 * @param {string} newPassword 新密码
 */
async function changePassword(userName, password, newPassword) {
  const result = await updateUser(
    {
        newPassword: doCrypto(newPassword)
    },
    {
        userName,
        password: doCrypto(password)
    }
  )
  if (result) {
    // 成功
    return new SuccessModel()
  }
  // 失败
  return new ErrorModel(changePasswordFailInfo)
}

/**
 * 退出登录
 * @param {Object} ctx ctx
 */
async function logout(ctx) {
  delete ctx.session.userInfo
  return new SuccessModel()
}

module.exports = {
  register,
  isExist,
  login,
  changeInfo,
  changePassword,
  logout
}
