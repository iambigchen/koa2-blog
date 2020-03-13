/**
 * @description 格式化数据
 * @author cy
 */

const {DEFAULT_PICTURE} = require('../config/constant')
const {timeFormat} = require('../utils/dt')
const REG_FOR_AT_WHO = /@(.+?)\s-\s(\w+?)\b/g
/**
 * 格式化用户头像
 * @param {*} obj 用户对象
 */
function _formatUserPicture(obj) {
  if (obj.picture == null) {
    obj.picture = DEFAULT_PICTURE
  }
  return obj
}

/**
 * 格式化用户信息
 * @param {Array | Object} list 用户列表或者单个用户对象
 */
function formatUser(list) {
  if (list === null) {
    return list
  }
  if (list instanceof Array) {
    // 数组 用户列表
    return list.map(_formatUserPicture)
  }
  // 单个对象
  return _formatUserPicture(list)
}


/**
 * 格式化博客内容
 * @param {Object} obj 博客内容
 */
function _formatContent(obj) {
  let contentFormat = obj.content
  contentFormat = contentFormat.replace(REG_FOR_AT_WHO,
    (matchStr, nickName, userName) => {
    return `<a href="/profile/${userName}">@${nickName}</a>`
  })
  obj.contentFormat = contentFormat

  return obj
}

/**
 * 格式化博客时间
 * @param {Object} obj
 */
function _formatDBTime(obj) {
  obj.createdAtFormat = timeFormat(obj.createdAt)
  obj.updatedAtFormat = timeFormat(obj.updatedAt)
  return obj
}

/**
 * 格式化博客
 * @param {Array | Object} list 博客列表或内容
 */
function formatBlog(list) {
  if (list == null) {
    return list
  }
  if (Array.isArray(list)) {
    return list.map(_formatContent).map(_formatDBTime)
  }
  // 对象
  let result = list
  result = _formatDBTime(result)
  result = _formatContent(result)
  return result
}

module.exports = {
  formatUser,
  formatBlog
}
