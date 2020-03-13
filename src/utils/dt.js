/**
 * @description 时间处理工具
 * @author cy
 */

const { format } = require('date-fns')

/**
 * 时间格式化处理
 * @param {string} time
 */
function timeFormat(time) {
  return format(new Date(time), 'MM.dd HH:mm')
}

module.exports = {
  timeFormat
}
