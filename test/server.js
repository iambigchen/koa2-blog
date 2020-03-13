/**
 * @description jest server
 * @author cy
 */
const request = require('supertest')
const server = require('../src/app').callback()

module.exports = request(server)
