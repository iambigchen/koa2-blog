/**
 * @description blog validator
 * @author cy
 */

const validate = require('./_validate')

const SCHEMA = {
  type: 'object',
  properties: {
    content: {
      type: 'string'
    },
    image: {
        type: 'string',
        maxLength: 255
    }
  }
}
/**
 * 校验微博数据格式
 * @param {Object} data 博客数据
 */
function blogValidate(data = {}) {
  return validate(SCHEMA, data)
}

module.exports = blogValidate
