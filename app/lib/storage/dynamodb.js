// @ts-check
const AWS = require('aws-sdk')
const { v4: uuid } = require('uuid')
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
   * @param {string} userKey
   * @param {import('../types').Activity} activity
   */
  async addActivity(userKey, activity) {
    const { points } = activity
    const now = Date.now()
    const key = uuid()
    await this.client
      .put({
        TableName: `Activities-${environment()}`,
        Item: {
          key,
          name: activity.name,
          file: activity.file,
          startedAt: activity.startedAt,
          createdWith: activity.createdWith,
          userKey,
          createdAt: now,
          updatedAt: now,
          deletedAt: null
        }
      })
      .promise()
    for (let index = 0; index < points.length; index++) {
      const point = points[index]
      await this.client
        .put({
          TableName: `ActivityPoints-${environment()}`,
          Item: {
            activityKey: key,
            latitude: point.latitude,
            longitude: point.longitude,
            altitude:
              typeof point.altitude === 'number'
                ? point.altitude
                : (points[index - 1] && points[index - 1].altitude) || 0,
            timestamp: point.timestamp,
            userKey,
            createdAt: now,
            updatedAt: now
          }
        })
        .promise()
      console.log(
        `Inserting point ${index}, [${point.latitude},${point.longitude},${point.altitude}]`
      )
    }
  }

  /**
   *
   * @param {string} userKey
   */
  async getPoints(userKey) {
    const points = []
    let nextEvaluateKey = null
    do {
      const response = await this.client
        .query({
          TableName: `ActivityPoints-${environment()}`,
          IndexName: 'UserPointsIndex',
          KeyConditionExpression: 'userKey = :userKey',
          ExpressionAttributeValues: {
            ':userKey': userKey
          },
          ExclusiveStartKey: nextEvaluateKey,
          ScanIndexForward: true
        })
        .promise()
      nextEvaluateKey = response.LastEvaluatedKey

      const items = response.Items || []
      points.push(...items)
    } while (nextEvaluateKey)
    return []
  }

  /**
   *
   * @param {string} userKey
   * @param {string} boundary
   * @param {string} path
   */
  async addHeatMapImage(userKey, boundary, path) {
    const now = Date.now()
    const key = uuid()
    await this.client
      .put({
        TableName: `HeatMaps-${environment()}`,
        Item: {
          key,
          userKey,
          boundary,
          path,
          createdAt: now,
          updatedAt: now,
          deletedAt: null
        }
      })
      .promise()
  }

  /**
   *
   * @param {string} userKey
   * @returns {Promise<import('.').StoredHeatMap[]>}
   */
  async loadAllHeatMapImages(userKey) {
    const result = []
    let nextEvaluateKey = null
    do {
      const response = await this.client
        .query({
          TableName: `HeatMaps-${environment()}`,
          IndexName: 'UserHeatMapsIndex',
          KeyConditionExpression: 'userKey = :userKey',
          ExpressionAttributeValues: {
            ':userKey': userKey
          },
          ExclusiveStartKey: nextEvaluateKey,
          ScanIndexForward: true
        })
        .promise()
      nextEvaluateKey = response.LastEvaluatedKey
      const items = response.Items || []
      result.push(...items)
    } while (nextEvaluateKey)

    return result
  }

  /**
   *
   * @param {string} key
   *
   * @returns {Promise<import('.').StoredHeatMap | null>}
   */
  async getHeatMapImage(key) {
    const record = await this.client
      .get({
        TableName: `HeatMaps-${environment()}`,
        Key: {
          key
        }
      })
      .promise()
    return /** @type {import('.').StoredHeatMap} */ (record.Item) || null
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
        ConsistentRead: true,
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
    const record = await this.client
      .get({
        TableName: `Users-${environment()}`,
        ConsistentRead: true,
        Key: {
          key
        }
      })
      .promise()
    if (!record.Item) return null
    return /** @type {import('./index').StoredUser} */ (record.Item)
  }

  /**
   *
   * @param {string} email
   * @returns {Promise<import('./index').StoredUser | null>}
   */
  async getUserByEmail(email) {
    const table = `Users-${environment()}`
    const records = await this.client
      .query({
        TableName: table,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email
        },
        Limit: 1
      })
      .promise()
    if (!records.Items || records.Items.length === 0) {
      return null
    }

    const key = records.Items[0].key
    const record = await this.client
      .get({
        TableName: table,
        Key: {
          key
        }
      })
      .promise()
    return /** @type {import('./index').StoredUser} */ (record.Item)
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
    const key = uuid()
    await this.client
      .put({
        TableName: `Users-${environment()}`,
        Item: {
          key,
          email,
          salt,
          hash,

          createdAt: now,
          updatedAt: now,
          deletedAt: null
        }
      })
      .promise()
    return {
      key,
      email,
      salt,
      hash,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    }
  }
}

module.exports = DynamoDBStorage
