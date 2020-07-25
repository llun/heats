const test = require('ava')
const sinon = require('sinon')

const SQLStorage = require('../lib/storage/sql')
const { loadMigrations, loadFixtures } = require('../lib/testUtils')
const { passwordAuthenticate } = require('./auth')

test.beforeEach(async (t) => {
  const storage = new SQLStorage({
    connection: ':memory:'
  })
  const db = storage.db
  await loadMigrations(db)
  await loadFixtures(storage)

  t.context = {
    storage,
    handler: passwordAuthenticate(storage)
  }
})

test('#passwordAuthenticate calls callback with user', async (t) => {
  const { storage, handler } = t.context

  const callback = sinon.stub()
  await handler('user1@test.llun.dev', 'password', callback)

  t.true(
    callback.calledWith(null, {
      key: '1',
      email: 'user1@test.llun.dev'
    })
  )
})

test('#passwordAuthenticate calls callback with false when password is invalid', async (t) => {
  const { storage, handler } = t.context

  const callback = sinon.stub()
  await handler('user1@test.llun.dev', 'invalid password', callback)

  t.true(callback.calledWith(null, false))
})

test('#passwordAuthenticate calls callback with false when user is not exist', async (t) => {
  const { storage, handler } = t.context

  const callback = sinon.stub()
  await handler('nouser@test.llun.dev', 'password', callback)

  t.true(callback.calledWith(null, false))
})
