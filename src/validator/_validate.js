/**
 * @description json schema校验
 */

const Ajv = require('ajv')
const ajv = new Ajv({
    // allErrors: true // 输出所有的错误（比较慢）
})

/**
 * json schema 校验
 * @param {Object} schema json schema规则
 * @param {Object} data 待校验的数据
 */
function validate(schema, data = {}) {
  let valid = ajv.validate(schema, data)
  console.log('valid', valid)
  if (!valid) {
    return ajv.errors[0]
  }
}

module.exports = validate
