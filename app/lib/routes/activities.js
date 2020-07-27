// @ts-check
const fs = require('fs')
const Router = require('@koa/router')

const { renderPage } = require('./tools')
const { parseGPX, parseTCX, parseFIT } = require('../parser')

/**
 *
 * @param {Buffer} buffer
 * @param {string} filename
 * @returns {import('../types').Parser | null}
 */
function getParser(buffer, filename) {
  if (buffer.slice(8, 12).toString('ascii') === '.FIT') return parseFIT
  else if (filename.endsWith('gpx')) return parseGPX
  else if (filename.endsWith('tcx')) return parseTCX
  else return null
}

/**
 *
 * @param {import('../types').AppContext} ctx
 */
async function createActivity(ctx) {
  if (!ctx.files || !ctx.files.upload) {
    ctx.flash('alert-danger', 'File is required')
    ctx.redirect('/activities/upload')
    return
  }

  const upload = ctx.files.upload[0]
  const buffer = fs.readFileSync(upload.path)
  const parser = getParser(buffer, upload.originalFilename)
  if (!parser) {
    ctx.flash('alert-danger', 'Unsupported file')
    ctx.redirect('/activities/upload')
    return
  }

  await parser(buffer, upload.originalFilename)
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
  /** @type {import('../types').AppRouter} */
  const router = new Router()
  router.post('/', createActivity)
  router.get('/import', renderPage('authenticated/import.njk'))

  return router
}
