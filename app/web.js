// @ts-check
const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const CSRF = require('koa-csrf')
const session = require('koa-session')
const static = require('koa-static')
const passport = require('koa-passport')
const views = require('koa-views')
const nunjucks = require('nunjucks')
const multiparty = require('multiparty')

const { setup } = require('./lib/auth')
const { getStorage } = require('./lib/storage')
const { getFileLoader } = require('./lib/file')

const { routes } = require('./lib/routes')
const { getBackgroundRunner } = require('./lib/background')

/**
 * @returns {import('koa')}
 */
module.exports = function main() {
  const app = new Koa()

  const _passport = /** @type {any} */ (passport)
  const router = routes(/** @type {import('passport')} */ (_passport))

  const csrf = new CSRF()
  app.keys = [process.env.SESSION_SECRET || Math.random().toString(36)]
  setup(passport)

  app
    .use(logger())
    .use(bodyParser())
    .use(async (ctx, next) => {
      const request = ctx.request
      const header = request.header
      if (
        header['content-type'] &&
        header['content-type'].startsWith('multipart/form-data')
      ) {
        const form = new multiparty.Form()
        const { fields, files } = await new Promise((resolve, reject) => {
          form.parse(ctx.req, function (err, fields, files) {
            if (err) {
              reject(err)
              return
            }
            const result = {
              fields: Object.keys(fields).reduce((out, key) => {
                if (fields[key].length === 1) {
                  out[key] = fields[key][0]
                } else {
                  out[key] = fields[key]
                }
                return out
              }, {}),
              files
            }

            resolve(result)
          })
        })
        ctx.request.body = fields
        ctx.files = files
      }
      await next()
    })
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
    .use(csrf)
    .use(async (ctx, next) => {
      ctx.state.csrf = ctx.csrf

      const fileLoader = await getFileLoader()
      ctx.fileLoader = fileLoader

      const storage = await getStorage()
      ctx.storage = storage

      const backgroundRunner = await getBackgroundRunner()
      ctx.backgroundRunner = backgroundRunner

      /**
       *
       * @param {import('./lib/types').FlashType} type
       * @param {string} msg
       */
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
