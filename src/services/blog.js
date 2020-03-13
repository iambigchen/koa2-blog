/**
 * @description blog servers
 * @author cy
 */
const Blog = require('../db/model/Blog')
const User = require('../db/model/User')
const UserRelation = require('../db/model/UserRelation')
const {formatUser, formatBlog} = require('./_format')
 /**
  * 创建微博
  * @param {Object} param0
  */
async function createBlog({ userId, content, image }) {
  const result = await Blog.create({
    userId,
    content,
    image
  })
  return result.dataValues
}

/**
 * 获取关注人博客列表
 * @param {Object} param0 查询条件 { userId, pageIndex = 0, pageSize = 10 }
 */
async function getFollowersBlogList({ userId, pageIndex = 0, pageSize = 10 }) {
  const result = await Blog.findAndCountAll({
    limit: pageSize, // 每页多少条
    offset: pageSize * pageIndex, // 跳过多少条
    order: [
      ['id', 'desc']
    ],
    include: [
      {
        model: User,
        attributes: ['userName', 'nickName', 'picture']
      },
      {
        model:UserRelation,
        attributes: ['userId', 'followerId'],
        where: { userId }
      }
    ]
  })
  let blogList = result.rows.map(row => formatBlog(row.dataValues))
  blogList = blogList.map(blogItem => {
    blogItem.user = formatUser(blogItem.user.dataValues)
    return blogItem
  })

  return {
    count: result.count,
    blogList
  }
}

/**
 * 由用户名获取博客列表
 * @param {*} param0
 */
async function getBlogListByUser({ userName, pageIndex = 0, pageSize = 10 }) {
  // 拼接查询条件
  const userWhereOpts = {}
  if (userName) {
      userWhereOpts.userName = userName
  }

  // 执行查询
  const result = await Blog.findAndCountAll({
      limit: pageSize, // 每页多少条
      offset: pageSize * pageIndex, // 跳过多少条
      order: [
          ['id', 'desc']
      ],
      include: [
          {
              model: User,
              attributes: ['userName', 'nickName', 'picture'],
              where: userWhereOpts
          }
      ]
  })

  // 获取 dataValues
  let blogList = result.rows.map(row => row.dataValues)

  // 格式化
  blogList = formatBlog(blogList)
  blogList = blogList.map(blogItem => {
      const user = blogItem.user.dataValues
      blogItem.user = formatUser(user)
      return blogItem
  })

  return {
    count: result.count,
    blogList
  }
}


module.exports = {
  createBlog,
  getFollowersBlogList,
  getBlogListByUser
}
