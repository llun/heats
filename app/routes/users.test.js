const test = require('ava')
const sinon = require('sinon')

const SQLStorage = require('../lib/storage/sql')
const {
  loadMigrations,
  createKoaContext,
  loadFixtures
} = require('../lib/testUtils')
const { createUser } = require('./users')

test.beforeEach(async (t) => {
  const storage = new SQLStorage({
    connection: ':memory:'
  })
  const db = storage.db
  await loadMigrations(db)
  await loadFixtures(storage)

  t.context = {
    storage
  }
})

test('#createUser add new record into database and redirect to sigin', async (t) => {
  const { storage } = t.context
  const ctx = createKoaContext({
    storage,
    body: { username: 'sample@test.llun.dev', password: 'password' }
  })
  await createUser(ctx)
  const user = await storage.getUserByKey('1')
  t.notThrows(() => {
    sinon.assert.match(user, {
      key: sinon.match.string,
      email: sinon.match.string
    })
  })
  t.true(ctx.flash.calledWith('alert-success', 'User is created'))
  t.true(ctx.redirect.calledWith('/'))
})

test('#createUser does not create user and redirect to signup with error flash', async (t) => {
  const { storage } = t.context
  const ctx = createKoaContext({
    storage,
    body: { username: 'user1@test.llun.dev', password: 'password' }
  })
  await createUser(ctx)
  const user = await storage.getUserByKey('2')
  t.is(user, null)
  t.true(ctx.flash.calledWith('alert-danger', 'Fail to create user'))
  t.true(ctx.redirect.calledWith('/signup'))
})

test('#createUser does not create user when password is empty', async (t) => {
  const { storage } = t.context
  const ctx = createKoaContext({
    storage,
    body: { username: 'user1@test.llun.dev', password: '' }
  })
  await createUser(ctx)
  const user = await storage.getUserByKey('2')
  t.is(user, null)
  t.true(ctx.flash.calledWith('alert-danger', 'Password is required'))
  t.true(ctx.redirect.calledWith('/signup'))
})
