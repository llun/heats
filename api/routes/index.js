// @ts-check
const Router = require('@koa/router')

const { routes: users } = require('./users')

const getLayers = require('./getLayers')
const getLayer = require('./getLayer')
const postTrackFile = require('./postTrackFile')

/**
 *
 * @param {string} name Template file name e.g. index.njk
 */
function renderPage(name) {
  return async function page(ctx) {
    await ctx.render(name)
  }
}
exports.renderPage = renderPage

/**
 * @param {import('@koa/multer').Instance} upload
 *
 * @returns {import('@koa/router')}
 */
exports.routes = (upload) => {
  const router = new Router()
  router.get('/', renderPage('index.njk'))
  router.get('/signup', renderPage('signup.njk'))
  router.get('/upload', renderPage('upload.njk'))

  router.use('/users', users(upload).routes())

  router.get('/layers', getLayers)
  router.get('/layers/:bound', getLayer)
  router.post('/tracks', upload.single('file'), postTrackFile)

  return router
}
