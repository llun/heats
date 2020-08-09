// @ts-check
/**
 * @typedef {'importStravaBackup'} TaskName
 * @typedef {{ name: 'importStravaBackup', data: { path: string, userKey: string }}} Task
 */
const fs = require('fs')
const MapHeat = require('mapheat')
const { getStorage } = require('../../storage')

async function run() {
  const storage = await getStorage()
  try {
    const points = await storage.getPoints('1')
    const blocks = /** @type {import('mapheat/types').Blocks} */ ({})
    const instance = new MapHeat()
    for (const point of points) {
      instance.addPoint(point, blocks)
    }
    const userDir = `${__dirname}/users/1`
    try {
      fs.accessSync(userDir)
    } catch (error) {
      fs.mkdirSync(userDir, { recursive: true })
    }
    instance.write(userDir, blocks)
  } finally {
    await storage.close()
  }
}

run()
  .then(() => {
    console.log('Done')
  })
  .catch((error) => {
    console.error(error.message)
    console.error(error.stack)
  })
