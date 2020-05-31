// @ts-check
const fs = require('fs')
const { URL } = require('url')

module.exports = function (ctx) {
  const url = new URL(ctx.request.url, 'https://localhost')
  const { bound } = ctx.params
  const filename = `${url.searchParams.get('dir')}/${bound}.png`
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
