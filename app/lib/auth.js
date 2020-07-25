// @ts-check
const crypto = require('crypto')
const LocalStrategy = require('passport-local').Strategy

const { getStorage } = require('./storage')

/**
 *
 * @param {import('./storage').Storage} storage
 */
function passwordAuthenticate(storage) {
  return async function (email, password, done) {
    const user = await storage.getUserByEmail(email)
    if (!user) {
      return done(null, false)
    }

    const hash = crypto.scryptSync(password, user.salt, 64).toString('hex')
    if (hash !== user.hash) {
      return done(null, false)
    }

    done(null, {
      key: user.key,
      email: user.email
    })
  }
}
exports.passwordAuthenticate = passwordAuthenticate

exports.authenticatedGuard = async function (ctx, next) {
  if (!ctx.isAuthenticated()) {
    ctx.redirect(`/`)
    return
  }
  await next()
}

exports.unauthenticatedGuard = async function (ctx, next) {
  if (ctx.isAuthenticated()) {
    ctx.redirect(`/app`)
    return
  }
  await next()
}

exports.setup = async function (passport) {
  const storage = await getStorage()

  passport.serializeUser(function (user, done) {
    done(null, user.key)
  })

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await storage.getUserByKey(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })

  passport.use(new LocalStrategy(passwordAuthenticate(storage)))
}
