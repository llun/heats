// @ts-check
const fs = require('fs')
const path = require('path')
const sinon = require('sinon')

const MIGRATE_UP_HEADER = '-- +migrate Up'
const MIGRATE_DOWN_HEADER = '-- +migrate Down'

/**
 *
 * @param {import('knex')} knex
 */
async function loadMigrations(knex) {
  const migrationRoot = path.resolve(
    `${__dirname}/../../database/migrations/sqlite3`
  )
  const dir = fs.readdirSync(migrationRoot)
  for (const file of dir) {
    const filePath = path.join(migrationRoot, file)

    const data = fs.readFileSync(filePath)
    const migrationData = data.toString('utf8')
    const migrateUpIndex = migrationData.indexOf(MIGRATE_UP_HEADER)
    const sql = migrationData.slice(
      migrateUpIndex + MIGRATE_UP_HEADER.length,
      data.indexOf(MIGRATE_DOWN_HEADER)
    )
    const queries = sql
      .split(';')
      .map((item) => item.trim())
      .filter((item) => item)
      .map((item) => `${item};`)
    for (const query of queries) {
      await knex.raw(query)
    }
  }
}
exports.loadMigrations = loadMigrations

/**
 *
 * @param {import('./storage').Storage} storage
 */
async function loadFixtures(storage) {
  await storage.createUser(
    'user1@test.llun.dev',
    '0a1dbf84b08a3a4e93d7f8548750d71bf2495ec79d2e835cb74ed7c0bd99bf3c',
    '5ffe3f0d871c63e1d8e1ad04d532ef9a2c04d77630f339f24e64408254a071a937228fa8e687b83d8a9cca1177b7240471e51662fe55e7b4f9206aea600f8b20'
  )
}
exports.loadFixtures = loadFixtures

/**
 *
 * @param {{ storage: import('./storage').Storage, body?: any }} param0
 */
function createKoaContext({ storage, body }) {
  return {
    request: { body },
    state: { storage },
    flash: sinon.stub(),
    redirect: sinon.stub()
  }
}
exports.createKoaContext = createKoaContext
