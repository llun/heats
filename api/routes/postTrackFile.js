// @ts-check
const { parseGPX } = require('../lib/parser')

function parseFitBuffer(buffer) {
  console.log('Parse fit file')
}

/**
 * @param {import('../lib/storage').Storage} storage
 * @param {string} filename
 * @param {Buffer} buffer
 */
async function parseTextBuffer(storage, filename, buffer) {
  if (!filename.endsWith('gpx') && !filename.endsWith('tcx')) {
    throw new Error('Unsupported file')
  }

  if (filename.endsWith('gpx')) {
    const activity = parseGPX(buffer)
    await storage.addActivity(1, activity)
  }
}

module.exports = async function (ctx) {
  const storage = /** @type {import('../lib/storage').Storage} */ (ctx.storage)
  const buffer = ctx.file.buffer
  try {
    if (buffer.slice(8, 12).toString('ascii') === '.FIT') {
      parseFitBuffer(buffer)
    } else {
      await parseTextBuffer(storage, ctx.file.originalname, buffer)
    }

    ctx.body = {
      success: true
    }
  } catch (error) {
    console.log(error.message)
    ctx.body = {
      success: false,
      error: error.message
    }
  }
}
