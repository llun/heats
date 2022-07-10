// @ts-check
const Router = require('@koa/router')

/**
 *
 * @param {import('../types').AppContext} ctx
 */
async function getLayer(ctx) {
  const storage = ctx.storage
  const fileLoader = ctx.fileLoader

  const { key } = ctx.params
  const data = await storage.getHeatMapImage(key)
  if (!data) {
    ctx.status = 404
    ctx.body = {
      success: false,
      error: 'not found'
    }
    return
  }

  const buffer = await fileLoader.load(data.path)
  ctx.set('Content-Type', 'image/png')
  ctx.body = buffer
}
exports.getLayer = getLayer

/**
 *
 * @param {import('../types').AppContext} ctx
 */
async function getLayers(ctx) {
  const storage = ctx.storage
  try {
    const heatmaps = await storage.loadAllHeatMapImages(ctx.state.user.key)
    ctx.body = {
      success: true,
      result: {
        bounds: heatmaps.map((item) => ({
          key: item.key,
          boundary: item.boundary
        }))
      }
    }
  } catch (error) {
    ctx.body = {
      success: true,
      result: {
        bounds: []
      }
    }
  }
}
exports.getLayers = getLayers

/**
 * @param {import('passport')} passport
 *
 * @returns {import('../types').AppRouter}
 */
exports.routes = (passport) => {
  /** @type {import('../types').AppRouter} */
  const router = new Router()
  router.get('/', getLayers)
  router.get('/:key', getLayer)
  return router
}
