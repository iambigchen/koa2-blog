/**
 * @description login user test
 * @author cy
 */
const server = require('../server')

// 用户信息
const userName = `u_${Date.now()}`
const password = `p_${Date.now()}`
const testUser = {
    userName,
    password,
    nickName: userName,
    gender: 1
}

// 注册
test('注册一个用户', async () => {
  const res =  await server
  .post('/api/user/register').send(testUser)
  expect(res.body.errno).toBe(0)
})

// 用户是否存在
test("查询注册的用户名，应该存在", async () => {
  const res = await server.post('/api/user/isExist').send({
    userName: testUser.userName
  })
  expect(res.body.errno).toBe(0)
})

// json schema 检测
test('json schema 检测： 非法输入，应该报错',  async () => {
  const res =  await server
    .post('/api/user/register')
    .send({
      userName: '123', // 用户名不是字母（或下划线）开头
      password: 'a', // 最小长度不是 3
      // nickName: ''
      gender: 'mail' // 不是数字
  })
  expect(res.body.errno).not.toBe(0)
})


// 登录
test('登录应该成功', async () => {
  const res =  await server
    .post('/api/user/login')
    .send({
      userName,
      password
    })
  expect(res.body.errno).toBe(0)
})
