// @ts-check
const SQLStorage = require('./sql')
const DynamoDBStorage = require('./dynamodb')

/** @type {import('./index').Storage | null} */
let _instance = null
/**
 * @returns {Promise<import('./index').Storage>}
 */
const getStorage = async () => {
  if (!_instance) {
    if (process.env.DYNAMODB) {
      _instance = new DynamoDBStorage()
    } else {
      _instance = new SQLStorage()
    }
  }

  return _instance
}
exports.getStorage = getStorage
