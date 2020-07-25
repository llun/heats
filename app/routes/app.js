// @ts-check
const Router = require('@koa/router')
const { renderPage } = require('./tools')

/**
 * @param {import('@koa/multer').Instance} upload
 * @param {import('passport')} passport
 *
 * @returns {import('@koa/router')}
 */
exports.routes = (upload, passport) => {
  /** @type {import('../lib/types').AppRouter} */
  const router = new Router()

  router.get('/', renderPage('app.njk'))

  return router
}
