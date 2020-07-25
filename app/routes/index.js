// @ts-check
const Router = require('@koa/router')

const { renderPage } = require('./tools')
const { authenticatedGuard, unauthenticatedGuard } = require('../lib/auth')
const { routes: users } = require('./users')
const { routes: app } = require('./app')

const getLayers = require('./getLayers')
const getLayer = require('./getLayer')
const postTrackFile = require('./postTrackFile')

/**
 * @param {import('@koa/multer').Instance} upload
 * @param {import('passport')} passport
 *
 * @returns {import('@koa/router')}
 */
exports.routes = (upload, passport) => {
  const router = new Router()
  router.get('/', unauthenticatedGuard, renderPage('index.njk'))
  router.get('/signup', unauthenticatedGuard, renderPage('signup.njk'))
  router.get('/upload', authenticatedGuard, renderPage('upload.njk'))

  router.use('/users', users(upload, passport).routes())
  router.use('/app', authenticatedGuard, app(upload, passport).routes())

  router.get('/layers', getLayers)
  router.get('/layers/:bound', getLayer)
  router.post('/tracks', upload.single('file'), postTrackFile)

  return router
}
