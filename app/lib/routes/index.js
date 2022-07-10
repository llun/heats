// @ts-check
const Router = require('@koa/router')

const { renderPage } = require('./tools')
const { authenticatedGuard, unauthenticatedGuard } = require('../auth')
const { routes: users } = require('./users')
const { routes: app } = require('./app')
const { routes: activities } = require('./activities')
const { routes: layers } = require('./layers')

/**
 * @param {import('passport')} passport
 *
 * @returns {import('../types').AppRouter}
 */
exports.routes = (passport) => {
  /** @type {import('../types').AppRouter} */
  const router = new Router()
  router.get('/', unauthenticatedGuard, renderPage('index.njk'))
  router.get('/signup', unauthenticatedGuard, renderPage('signup.njk'))

  router.use('/users', users(passport).routes())
  router.use('/app', authenticatedGuard, app(passport).routes())
  router.use('/activities', authenticatedGuard, activities(passport).routes())
  router.use('/layers', authenticatedGuard, layers(passport).routes())

  return router
}
