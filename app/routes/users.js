// @ts-check
const crypto = require('crypto')
const Router = require('@koa/router')

/**
 *
 * @param {import('../lib/types').AppContext} ctx
 */
async function createUser(ctx) {
  const { username, password } = ctx.request.body
  /** @type {import('../lib/storage').Storage} */
  const storage = ctx.state.storage

  if (!password || password.trim().length === 0) {
    ctx.flash('alert-danger', 'Password is required')
    ctx.redirect('/signup')
    return
  }

  const existingUser = await storage.getUserByEmail(username)
  if (existingUser) {
    ctx.flash('alert-danger', 'Fail to create user')
    ctx.redirect('/signup')
    return
  }

  const salt = crypto.randomBytes(32).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  await storage.createUser(username, salt, hash)
  ctx.flash('alert-success', 'User is created')
  ctx.redirect('/')
}
exports.createUser = createUser

/**
 * @param {import('@koa/multer').Instance} upload
 *
 * @returns {import('@koa/router')}
 */
exports.routes = (upload) => {
  /** @type {import('../lib/types').AppRouter} */
  const router = new Router()

  router.post('/', createUser)

  return router
}
