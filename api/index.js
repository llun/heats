// @ts-check
const Koa = require('koa')
const Router = require('@koa/router')

const getLayers = require('./routes/getLayers')
const getLayer = require('./routes/getLayer')

/**
 * @returns {import('koa')}
 */
module.exports = function main() {
  const app = new Koa()
  const router = new Router()
  router.get('/layers', getLayers)
  router.get('/layers/:bound', getLayer)

  app
    .use(require('koa-logger')())
    .use(router.routes())
    .use(require('koa-static')('../static'))
    .use(router.allowedMethods())

  return app
}
