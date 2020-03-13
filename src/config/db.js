/**
 * @description 存储配置
 * @author cy
 */

const {isProd} = require('../utils/env')

let MYSQL_CONF
let REDIS_CONF

if (isProd) {
  MYSQL_CONF = {
    host: '127.0.0.1',
    user: 'root',
    password: 'ab159951',
    port: '3306',
    database: 'myblog'
  }
  //redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
} else {
  // mysql1
  MYSQL_CONF = {
    host: '127.0.0.1',
    user: 'root',
    password: 'ab159951',
    port: '3306',
    database: 'myblog'
  }
  //redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}
