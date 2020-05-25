// @ts-check

module.exports = function (/** @type {import('koa').Context} */ ctx) {
  console.log(ctx.body)
  ctx.body = {
    success: true,
  }
}
