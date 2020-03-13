/**
 * @description sequelize 实例
 * @author cy
 */

const Sequelize = require('sequelize')
const { MYSQL_CONF } = require('../config/db')
const { isProd, isTest } = require('../utils/env')

const { host, user, password, database } = MYSQL_CONF
const conf = {
    host,
    dialect: 'mysql'
}

const seq = new Sequelize(database, user, password, conf)
module.exports = seq
