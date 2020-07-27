// @ts-check
const fs = require('fs')
const Router = require('@koa/router')

const { renderPage } = require('./tools')
const { isSupportedFile } = require('../parser')

/**
 *
 * @param {import('../types').AppContext} ctx
 */
async function createActivity(ctx) {
  if (!ctx.files || !ctx.files.upload) {
    ctx.flash('alert-danger', 'File is required')
    ctx.redirect('/activities/import')
    return
  }

  const upload = ctx.files.upload[0]
  const buffer = fs.readFileSync(upload.path)
  if (!isSupportedFile(buffer, upload.originalFilename)) {
    ctx.flash('alert-danger', 'Unsupported file')
    ctx.redirect('/activities/import')
    return
  }

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
