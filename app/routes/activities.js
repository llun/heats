// @ts-check
const Router = require('@koa/router')
const { renderPage } = require('./tools')
const { parseGPX, parseTCX, parseFIT } = require('../lib/parser')

/**
 *
 * @param {Buffer} buffer
 * @param {string} filename
 * @returns {import('../lib/types').Parser | null}
 */
function getParser(buffer, filename) {
  if (buffer.slice(8, 12).toString('ascii') === '.FIT') return parseFIT
  else if (filename.endsWith('gpx')) return parseGPX
  else if (filename.endsWith('tcx')) return parseTCX
  else return null
}

/**
 *
 * @param {import('../lib/types').AppContext} ctx
 */
async function createActivity(ctx) {
  const buffer = ctx.file.buffer
  const parser = getParser(buffer, ctx.file.originalname)
  if (!parser) {
    ctx.flash('alert-danger', 'Unsupported file')
    ctx.redirect('/activities/upload')
    return
  }

  await parser(buffer, ctx.file.originalname)
  ctx.flash('alert-success', 'Your file will get process soon')
  ctx.redirect('/app')
}
exports.createActivity = createActivity

/**
 * @param {import('passport')} passport
 *
 * @returns {import('@koa/router')}
 */
exports.routes = (passport) => {
  /** @type {import('../lib/types').AppRouter} */
  const router = new Router()
  router.post('/', createActivity)
  router.get('/upload', renderPage('upload.njk'))

  return router
}
