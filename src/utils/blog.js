/**
 * @description 微博数据相关的工具方法
 * @author cy
 */
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

// 获取 blog-list.ejs 的文件内容
const BLOG_LIST_TPL = fs.readFileSync(path.join(__dirname, '..', 'views', 'widgets', 'blog-list.ejs')).toString()
/**
 * 获取博客列表模板字符串
 * @param {Array} list 博客列表
 * @param {Boolean} canReply 是否显示回复按钮
 */
 function getBlogListStr(list = [], canReply = false) {
    return ejs.render(BLOG_LIST_TPL, {
      blogList: list,
      canReply
    })
 }

 module.exports = {
  getBlogListStr
 }
