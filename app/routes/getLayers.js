// @ts-check
const fs = require('fs')
const path = require('path')

module.exports = async function (ctx) {
  const directory = path.join(`${__dirname}/../lib/tasks/users/1`)
  try {
    const bounds = fs.readdirSync(directory)
    ctx.body = {
      success: true,
      result: {
        dir: directory,
        bounds: bounds.map((bound) => bound.substring(0, bound.length - 4))
      }
    }
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    ctx.body = {
      success: true,
      result: {
        dir: directory,
        bounds: []
      }
    }
  }
}