// @ts-check
const fs = require('fs')

module.exports = function (ctx) {
  const { bound } = ctx.params
  const filename = `${__dirname}/layers/${bound}.png`

  try {
    fs.accessSync(filename)
  } catch (error) {
    ctx.status = 404
    ctx.body = {
      success: false,
      error: 'not found'
    }
    return
  }

  ctx.set('Content-Type', 'image/png')
  ctx.body = fs.createReadStream(filename)
}
