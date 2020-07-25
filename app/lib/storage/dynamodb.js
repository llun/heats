// @ts-check

class DynamoDBStorage {
  constructor() {}

  async close() {}

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
    return null
  }

  /**
   *
   * @param {string} key
   * @param {any} data
   */
  async updateSession(key, data) {
    throw new Error('No implementation')
  }

  /**
   *
   * @param {string} key
   */
  async destroySession(key) {
    throw new Error('No implementation')
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
