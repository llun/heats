// @ts-check
/**
 *
 * @param {import('koa')} app
 */
exports.api = function api(app) {
  app.use(require('koa-logger')())
  app.use(require('koa-static')('../static'))
}
