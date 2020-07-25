// @ts-check
const Koa = require('koa')
const multer = require('@koa/multer')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const CSRF = require('koa-csrf')
const session = require('koa-session')
const static = require('koa-static')
const passport = require('koa-passport')
const views = require('koa-views')
const nunjucks = require('nunjucks')

const { setup } = require('./lib/auth')
const { getStorage } = require('./lib/storage')

const { routes } = require('./routes')

/**
 * @returns {import('koa')}
 */
module.exports = function main() {
  const app = new Koa()
  const upload = multer()

  const _passport = /** @type {any} */ (passport)
  const router = routes(/** @type {import('passport')} */ (_passport))

  app.keys = [process.env.SESSION_SECRET || Math.random().toString(36)]
  setup(passport)

  app
    .use(logger())
    .use(upload.single('upload'))
    .use(bodyParser())
    .use(
      session(
        {
          store: {
            async get(key) {
              const storage = await getStorage()
              return storage.getSession(key)
            },
            async set(key, session, maxAge, { rolling, changed }) {
              if (!changed) {
                return
              }

              const storage = await getStorage()
              await storage.updateSession(key, session)
            },
            async destroy(key) {
              const storage = await getStorage()
              await storage.destroySession(key)
            }
          }
        },
        app
      )
    )
    .use(
      new CSRF({
        invalidTokenMessage: 'Invalid CSRF Token',
        invalidTokenStatusCode: 403,
        excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
        disableQuery: false
      })
    )
    .use(async (ctx, next) => {
      const storage = await getStorage()
      ctx.state.storage = storage
      ctx.state.csrf = ctx.csrf
      ctx.flash = function (type, msg) {
        ctx.session.flash = { type: type, message: msg }
      }
      if (ctx.session.flash) {
        ctx.state.flash = ctx.session.flash
        delete ctx.session.flash
      }
      if (ctx.session && ctx.session.passport && ctx.session.passport.user) {
        const user = await storage.getUserByKey(ctx.session.passport.user)
        ctx.state.user = user
      }
      await next()
    })
    .use(
      views(__dirname + '/views', {
        options: {
          loader: new nunjucks.FileSystemLoader(__dirname + '/views')
        },
        map: {
          njk: 'nunjucks'
        }
      })
    )
    .use(passport.initialize())
    .use(passport.session())

    .use(router.routes())
    .use(static(__dirname + '/static'))
    .use(router.allowedMethods())

  return app
}
