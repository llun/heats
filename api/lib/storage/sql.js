// @ts-check
const knex = require('knex')
const path = require('path')

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
  }

  /**
   *
   * @param {number} userId
   * @param {import('../types').Activity} activity
   */
  async addActivity(userId, activity) {
    const { points } = activity
    try {
      await this.db.transaction(async (trx) => {
        try {
          const now = Date.now()
          await Promise.all(
            points.map(async (point) =>
              this.db('points').transacting(trx).insert({
                latitude: point.latitude,
                longitude: point.longitude,
                altitude: point.altitude,
                timestamp: point.timestamp,
                created_at: now,
                updated_at: now,
                user_id: userId
              })
            )
          )
          await trx.commit()
        } catch (error) {
          console.log(error.message)
          await trx.rollback()
        }
      })
    } catch (error) {
      console.log('Fail to add activity', error)
    }
  }

  /**
   *
   * @param {number} userId
   */
  async getPoints(userId) {
    const pointsQuery = this.db('points').where({ user_id: userId })
    console.log(pointsQuery.toString())
    const points = /** @type {import('../types').Point[]} */ (await pointsQuery)
    return points
  }
}

module.exports = SQLStorage
