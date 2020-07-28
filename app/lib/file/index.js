// @ts-check
const LocalFileLoader = require('./local')

const _instance = new LocalFileLoader('/tmp')

/**
 * @returns {import('./index').FileLoader}
 */
exports.getFileLoader = () => {
  return _instance
}
