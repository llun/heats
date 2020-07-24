// @ts-check
const SQLStorage = require('./sql')

let _instance = null
/**
 * @returns {Promise<import('./index').Storage>}
 */
const getStorage = async () => {
  if (!_instance) {
    _instance = new SQLStorage()
  }

  return _instance
}
exports.getStorage = getStorage
