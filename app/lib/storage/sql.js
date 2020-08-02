// @ts-check
const knex = require('knex')
const path = require('path')
const { TimeoutError } = require('tarn')

/**
 * @typedef {import('knex').Config} Config
 */
class SQLStorage {
  /**
   *
   * @param {Config} [config]
   */
  constructor(config) {
    this.db = knex({
      client: 'sqlite3',
      connection: {
        filename: path.resolve(`${__dirname}/../../../database/data.db`)
      },
      useNullAsDefault: true,
      ...config
    })
    const client = this.db.client
    // TODO: Check does knex set null to client after destroy?
    client.acquireConnection = async function acquireConnection() {
      if (!this.pool) {
        this.initializePool()
      }
      try {
        const connection = await this.pool.acquire().promise
        return connection
      } catch (error) {
        let convertedError = error
        if (error instanceof TimeoutError) {
          convertedError = new knex.KnexTimeoutError(
            'Knex: Timeout acquiring a connection. The pool is probably full. ' +
              'Are you missing a .transacting(trx) call?'
          )
        }
        throw convertedError
      }
    }
  }

  async close() {
    return this.db.destroy()
  }

  /**
   *
   * @param {string} userKey
   * @param {import('../types').Activity} activity
   */
  async addActivity(userKey, activity) {
    const { points } = activity
    try {
      await this.db.transaction(async (trx) => {
        try {
          const now = Date.now()
          const insertedActivities = await this.db('activities')
            .transacting(trx)
            .insert({
              name: activity.name,
              file: activity.file,
              startedAt: activity.startedAt,
              createdWith: activity.createdWith,
              userId: userKey,
              createdAt: now,
              updatedAt: now
            })
          await Promise.all(
            points.map(async (point, index) =>
              this.db('points')
                .transacting(trx)
                .insert({
                  latitude: point.latitude,
                  longitude: point.longitude,
                  altitude:
                    typeof point.altitude === 'number'
                      ? point.altitude
                      : (points[index - 1] && points[index - 1].altitude) || 0,
                  timestamp: point.timestamp,
                  createdAt: now,
                  updatedAt: now,
                  userId: userKey,
                  activityId: insertedActivities[0]
                })
            )
          )
          await trx.commit()
        } catch (error) {
          console.error(error.message)
          await trx.rollback()
        }
      })
    } catch (error) {
      console.error('Fail to add activity', activity.file, error)
    }
  }

  /**
   *
   * @param {number} userId
   * @param {number} from
   * @param {number} to
   * @returns {Promise<import('../types').Point[]>}
   */
  async getPointsBetweenDate(userId, from, to) {
    throw new Error('No implementation')
  }

  /**
   *
   * @param {number} userId
   */
  async getPoints(userId) {
    const pointsQuery = this.db('points').where({ userId: userId })
    console.log(pointsQuery.toString())
    const points = /** @type {import('../types').Point[]} */ (await pointsQuery)
    return points
  }

  async getActivities(userId) {
    return []
  }

  /**
   * Session methods
   */

  /**
   *
   * @param {string} key
   * @return {Promise<import('../types').Session | null>}
   */
  async getSession(key) {
    const record = await this.db('sessions')
      .where('key', key)
      .whereNull('deletedAt')
      .first()
    if (!record) return null

    return (record.data && JSON.parse(record.data)) || null
  }

  /**
   *
   * @param {string} key
   * @param {any} data
   */
  async updateSession(key, data) {
    const now = Date.now()
    const db = this.db
    try {
      await db.transaction(async (trx) => {
        const existingSession = await trx('sessions')
          .where('key', key)
          .whereNull('deletedAt')
          .first()
        if (!existingSession) {
          await trx('sessions').insert({
            key,
            data: JSON.stringify(data),
            userId: data && data.passport && data.passport.user,
            createdAt: now,
            updatedAt: now
          })
          return
        }
        await trx('sessions')
          .where('key', key)
          .update({
            data: JSON.stringify(data),
            userId: data && data.passport && data.passport.user,
            updatedAt: now
          })
      })
    } catch (error) {
      console.error(error.message)
      throw error
    }
  }

  /**
   *
   * @param {string} key
   */
  async destroySession(key) {
    const now = Date.now()
    await this.db('sessions').where('key', key).update({
      deleted_at: now
    })
  }

  /**
   * User
   */
  /**
   *
   * @param {string} key
   * @returns {Promise<import('./index').StoredUser | null>}
   */
  async getUserByKey(key) {
    const record = await this.db('users').where('id', key).first()
    if (!record) return null

    return {
      key: `${record.id}`,
      email: record.email,
      salt: record.salt,
      hash: record.password,

      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt
    }
  }

  /**
   *
   * @param {string} email
   * @returns {Promise<import('./index').StoredUser | null>}
   */
  async getUserByEmail(email) {
    const record = await this.db('users').where('email', email).first()
    if (!record) return null

    return {
      key: `${record.id}`,
      email: record.email,
      salt: record.salt,
      hash: record.password,

      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt
    }
  }

  /**
   *
   * @param {string} email
   * @param {string} salt
   * @param {string} hash
   * @returns {Promise<import('./index').StoredUser | null>}
   */
  async createUser(email, salt, hash) {
    const now = Date.now()
    try {
      const [key] = await this.db('users').insert({
        email,
        salt,
        password: hash,

        createdAt: now,
        updatedAt: now
      })
      return this.getUserByKey(key)
    } catch (error) {
      console.error(error.message)
      return null
    }
  }
}

module.exports = SQLStorage
