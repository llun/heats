// @ts-check
/**
 * @typedef {'importStravaBackup'} TaskName
 * @typedef {{ name: 'importStravaBackup', data: { path: string, userKey: string }}} Task
 */

const path = require('path')
const { getStorage } = require('../../storage')
const { getParser } = require('../../parser')
const { getFileLoader } = require('../../file')
/**
 *
 * @param {Task} event
 */
async function run(event) {
  const storage = await getStorage()
  const file = getFileLoader()

  try {
    const buffer = await file.load(event.data.path)
    if (!buffer) {
      throw new Error(`Fail to load ${event.data.path}`)
    }
    const fileName = path.basename(event.data.path)
    const parser = getParser(buffer, fileName)
    if (!parser) {
      throw new Error('Unsupported file')
    }

    const userKey = event.data.userKey
    const activities = await parser(buffer, fileName)
    for (const activity of activities) {
      await storage.addActivity(userKey, activity)
    }
  } finally {
    await storage.close()
  }
}
exports.run = run
