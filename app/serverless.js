// @ts-check
/**
 * @typedef {import('aws-lambda').APIGatewayEvent} APIGatewayEvent
 * @typedef {import('aws-lambda').Context} Context
 */
const serverless = require('serverless-http')
const web = require('./web')
const { getStorage } = require('./lib/storage')

const app = web()
const handler = serverless(app)
exports.handler = handler

const entry = async (
  /** @type {APIGatewayEvent} */ event,
  /** @type {any} */ context
) => {
  const storage = await getStorage()
  const output = await handler(event, context)
  await storage.close()
  return output
}
exports.entry = entry
