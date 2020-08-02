// @ts-check
const SQSBackgroundRunner = require('./sqs')
const LocalBackground = require('./local')

/** @type {import('./index').BackgroundRunner | null} */
let _instance

/**
 * @returns {import('./index').BackgroundRunner}
 */
function getBackgroundRunner() {
  if (!_instance) {
    if (process.env.SQS) {
      _instance = new SQSBackgroundRunner(process.env.SQS || '')
    } else {
      _instance = new LocalBackground()
    }
  }
  return _instance
}
exports.getBackgroundRunner = getBackgroundRunner
