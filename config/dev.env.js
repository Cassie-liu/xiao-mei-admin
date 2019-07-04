'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://www.flighty-thought.cn:8087/smile-admin"'
  // BASE_API: '"http://192.168.0.105:8087/smile-admin"'
})
