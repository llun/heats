// @ts-check
const Router = require('@koa/router')
const { renderPage } = require('./tools')

/**
 * @param {import('passport')} passport
 *
 * @returns {import('../types').AppRouter}
 */
exports.routes = (passport) => {
  /** @type {import('../types').AppRouter} */
  const router = new Router()

  router.get('/', renderPage('authenticated/app.njk'))

  return router
}
