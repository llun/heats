// @ts-check
const Koa = require('koa')
const Router = require('@koa/router')
const multer = require('@koa/multer')

const SQLStorage = require('./lib/storage/sql')

const getLayers = require('./routes/getLayers')
const getLayer = require('./routes/getLayer')
const postTrackFile = require('./routes/postTrackFile')

/**
 * @returns {import('koa')}
 */
module.exports = function main() {
  const app = new Koa()
  const router = new Router()
  const upload = multer()

  router.get('/layers', getLayers)
  router.get('/layers/:bound', getLayer)
  router.post('/tracks', upload.single('file'), postTrackFile)

  app
    .use(require('koa-logger')())
    .use(async (ctx, next) => {
      ctx.storage = new SQLStorage()
      await next()
    })
    .use(router.routes())
    .use(require('koa-static')('../static'))
    .use(router.allowedMethods())

  return app
}
