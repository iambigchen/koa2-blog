/**
 * @description 广场页 controller
 * @author cy
 */
const {getSquareCacheList} = require('../cache/blog')
const {SuccessModel, ErrorModel} = require('../models/ResModel')
const PAGE_SIZE = 5
/**
 * 获取广场页博客
 * @param {Number} pageIndex 当前页数
 */
async function getSquareBlogList(pageIndex) {
  const result = await getSquareCacheList(pageIndex, PAGE_SIZE)
  const blogList = result.blogList

  // 拼接返回数据
  return new SuccessModel({
      isEmpty: blogList.length === 0,
      blogList,
      pageSize: PAGE_SIZE,
      pageIndex,
      count: result.count
  })
}

module.exports = {
  getSquareBlogList
}
