/**
 * @description @ relation services
 * @author cy
 */
const AtRelation = require('../db/model/AtRelation')
const User = require('../db/model/User')
const Blog = require('../db/model/Blog')
const { formatBlog, formatUser } = require('./_format')

/**
* 创建@关系
* @param {string} blogId 博客id
* @param {string} userId @人id
*/
async function createAtRelation(blogId, userId) {
  const result = await AtRelation.create({
    blogId,
    userId
  })
  return result.dataValues
}

/**
* 由userID获取@数量
* @param {*} userId
*/
async function getAtRelationCount(userId) {
  const result = await AtRelation.findAndCountAll({
    where: {
      userId,
      isRead: false
    }
  })
  return result.count
}

/**
* 获取at博客列表
* @param {Object} param0 查询条件 { userId, pageIndex, pageSize = 5 }
*/
async function getAtUserBlogList({ userId, pageIndex, pageSize = 5 }) {
const result = await Blog.findAndCountAll({
    limit: pageSize,
    offset: pageSize * pageIndex,
    order: [
      ['id', 'desc']
    ],
    include: [
        // @ 关系
        {
        model: AtRelation,
        attributes: ['userId', 'blogId'],
        where: { userId }
      },
      // User
      {
          model: User,
          attributes: ['userName', 'nickName', 'picture']
      }
    ]
  })

  // 格式化
  let blogList = result.rows.map(row => row.dataValues)
  blogList = formatBlog(blogList)
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
 * 更新 AtRelation
 * @param {Object} param0 更新内容
 * @param {Object} param1 查询条件
 */
async function updateAtRelation(
  { newIsRead }, // 要更新的内容
  { userId, isRead } // 条件
) {
  // 拼接更新内容
  const updateData = {}
  if (newIsRead) {
      updateData.isRead = newIsRead
  }

  // 拼接查询条件
  const whereData = {}
  if (userId) {
      whereData.userId = userId
  }
  if (isRead) {
      whereData.isRead = isRead
  }

  // 执行更新
  const result = await AtRelation.update(updateData, {
      where: whereData
  })
  return result[0] > 0
}

module.exports = {
  createAtRelation,
  getAtRelationCount,
  updateAtRelation,
  getAtUserBlogList
}
