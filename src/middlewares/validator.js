/**
 * @description 检验中间件
 * @author cy
 */

const {ErrorModel} = require('../models/ResModel')
const { jsonSchemaFileInfo } = require('../models/ErrorInfo')

/**
 * 生成检验中间件
 * @param {Function} validateFn 验证函数
 */
function genValidator(validateFn) {
  return async (ctx, next)=> {
    const data = ctx.request.body
    const error = validateFn(data)
    if (error) {
      // 验证失败
      ctx.body = new ErrorModel(jsonSchemaFileInfo)
      return
    }
    // 验证成功，继续
    await next()
  }
}

module.exports = {
  genValidator
}
