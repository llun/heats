// @ts-check
const Router = require('@koa/router')

const { renderPage } = require('./tools')
const { authenticatedGuard, unauthenticatedGuard } = require('../lib/auth')
const { routes: users } = require('./users')
const { routes: app } = require('./app')
const { routes: activities } = require('./activities')

const getLayers = require('./getLayers')
const getLayer = require('./getLayer')

/**
 * @param {import('passport')} passport
 *
 * @returns {import('@koa/router')}
 */
exports.routes = (passport) => {
  const router = new Router()
  router.get('/', unauthenticatedGuard, renderPage('index.njk'))
  router.get('/signup', unauthenticatedGuard, renderPage('signup.njk'))

  router.use('/users', users(passport).routes())
  router.use('/app', authenticatedGuard, app(passport).routes())
  router.use('/activities', authenticatedGuard, activities(passport).routes())

  router.get('/layers', getLayers)
  router.get('/layers/:bound', getLayer)

  return router
}
