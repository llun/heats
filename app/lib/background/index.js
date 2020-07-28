// @ts-check
const SQSBackgroundRunner = require('./sqs')

/** @type {import('./index').BackgroundRunner | null} */
let _instance

/**
 * @returns {import('./index').BackgroundRunner}
 */
function getBackgroundRunner() {
  if (!_instance) {
    _instance = new SQSBackgroundRunner(process.env.SQS || '')
  }
  return _instance
}
