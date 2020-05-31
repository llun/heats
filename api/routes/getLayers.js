// @ts-check
const fs = require('fs')

module.exports = function (ctx) {
  const bounds = fs.readdirSync(`${__dirname}/layers`)
  ctx.body = {
    success: true,
    result: bounds.map((bound) => bound.substring(0, bound.length - 4))
  }
}
