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

  async close() {
    return this.db.destroy()
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
          const insertedActivities = await this.db('activities')
            .transacting(trx)
            .insert({
              name: activity.name,
              file: activity.file,
              startedAt: activity.startedAt,
              createdWith: activity.createdWith,
              userId,
              createdAt: now,
              updatedAt: now
            })
          await Promise.all(
            points.map(async (point) =>
              this.db('points').transacting(trx).insert({
                latitude: point.latitude,
                longitude: point.longitude,
                altitude: point.altitude,
                timestamp: point.timestamp,
                createdAt: now,
                updatedAt: now,
                userId,
                activityId: insertedActivities[0]
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
