// @ts-check
/**
 * @typedef {'generateHeatMap'} TaskName
 * @typedef {{ name: TaskName, data: { userKey: string }}} Task
 */
const fs = require('fs')
const MapHeat = require('mapheat')
const { getStorage } = require('../../storage')
const { getFileLoader } = require('../../file')

/**
 *
 * @param {Task} task
 */
async function run(task) {
  const fileLoader = getFileLoader()
  const storage = await getStorage()
  try {
    const userKey = task.data.userKey
    const points = await storage.getPoints(userKey)
    const blocks = /** @type {import('mapheat/types').Blocks} */ ({})
    const instance = new MapHeat()
    for (const point of points) {
      instance.addPoint(point, blocks)
    }

    const nonEmptyBlocks = Object.keys(blocks).filter(
      (block) => blocks[block].points.size > 0
    )
    for (const block of nonEmptyBlocks) {
      const canvas = instance.draw(blocks[block])
      const path = await fileLoader.save(
        canvas.toBuffer(),
        'heatimage',
        `${block}.png`
      )
      if (!path) continue
      await storage.addHeatMapImage(userKey, block, path)
    }
  } finally {
    await storage.close()
  }
}
exports.run = run
