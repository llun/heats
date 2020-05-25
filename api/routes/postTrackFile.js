// @ts-check
module.exports = function (ctx) {
  console.log('ctx.request.file', ctx.request.file)
  console.log('ctx.file', ctx.file)
  console.log('ctx.request.body', ctx.request.body)
  ctx.body = {
    success: true,
  }
}
