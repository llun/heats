// @ts-check
const passport = require('koa-passport')
const crypto = require('crypto')

const { getStorage } = require('./storage')

exports.setup = async function (passport) {
  const storage = await getStorage()

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await storage.getUserByKey(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })

  const LocalStrategy = require('passport-local').Strategy
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      try {
        const user = await storage.authenticateUser(username, password)
        if (!user) {
          return done(null, false)
        }
        return done(null, user)
      } catch (error) {
        console.error(error)
        return done(error)
      }
    })
  )
}
