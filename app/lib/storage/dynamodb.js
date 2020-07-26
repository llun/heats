// @ts-check
const AWS = require('aws-sdk')
const { environment } = require('../utils')

class DynamoDBStorage {
  constructor() {
    this.client = new AWS.DynamoDB.DocumentClient()
  }

  async close() {
    console.log('close: do nothing')
  }

  /**
   *
   * @param {number} userId
   * @param {import('../types').Activity} activity
   */
  async addActivity(userId, activity) {
    throw new Error('No implementation')
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
   * @returns {Promise<import('../types').Point[]>}
   */
  async getPoints(userId) {
    throw new Error('No implementation')
  }

  /**
   *
   * @param {number} userId
   */
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
    const record = await this.client
      .get({
        TableName: `Sessions-${environment()}`,
        Key: {
          key
        }
      })
      .promise()
    if (!record.Item) {
      return null
    }

    const data = record.Item.data
    return JSON.parse(data)
  }

  /**
   *
   * @param {string} key
   * @param {any} data
   */
  async updateSession(key, data) {
    const now = Date.now()
    await this.client
      .put({
        TableName: `Sessions-${environment()}`,
        Item: {
          key,
          data: JSON.stringify(data),
          userId: data && data.passport && data.passport.user,
          createdAt: now,
          updatedAt: now,
          deletedAt: null
        }
      })
      .promise()
  }

  /**
   *
   * @param {string} key
   */
  async destroySession(key) {
    const now = Date.now()
    await this.client
      .update({
        TableName: `Sessions-${environment()}`,
        Key: {
          key
        },
        UpdateExpression: 'set deletedAt = :now',
        ExpressionAttributeValues: {
          ':now': now
        }
      })
      .promise()
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
    throw new Error('No implementation')
  }

  /**
   *
   * @param {string} email
   * @returns {Promise<import('./index').StoredUser | null>}
   */
  async getUserByEmail(email) {
    throw new Error('No implementation')
  }

  /**
   *
   * @param {string} email
   * @param {string} salt
   * @param {string} hash
   * @returns {Promise<import('./index').StoredUser | null>}
   */
  async createUser(email, salt, hash) {
    throw new Error('No implementation')
  }
}

module.exports = DynamoDBStorage
