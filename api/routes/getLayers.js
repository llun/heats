// @ts-check
const fs = require('fs')
const MapHeat = require('mapheat')

module.exports = async function (ctx) {
  const storage = /** @type {import('../lib/storage').Storage} */ (ctx.storage)
  const points = await storage.getPoints(1)

  const blocks = /** @type {import('mapheat/types').Blocks} */ ({})
  const instance = new MapHeat()
  for (const point of points) {
    instance.addPoint(point, blocks)
  }
  const tmp = `/tmp/mp-${Date.now()}`
  fs.mkdirSync(tmp)
  instance.write(tmp, blocks)
  const bounds = fs.readdirSync(tmp)
  ctx.body = {
    success: true,
    result: {
      dir: tmp,
      bounds: bounds.map((bound) => bound.substring(0, bound.length - 4))
    }
  }
}
