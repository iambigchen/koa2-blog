/**
 * @description blog-profile controller
 * @author cy
 */
const {getBlogListByUser} = require('../services/blog')
const {SuccessModel, ErrorModel} = require('../models/ResModel')
const PAGE_SIZE = 5
/**
 * 获取博客列表
 * @param {string} userName 用户名
 * @param {number} pageIndex 页数
 */
async function getProfileBlogList(userName, pageIndex) {
  const result = await getBlogListByUser({userName, pageIndex, PAGE_SIZE})
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
  getProfileBlogList
}
