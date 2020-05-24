// @ts-check
const http = require('http')
const Koa = require('koa')
const app = new Koa()

const { api } = require('./index')
api(app)

/**
 *
 * @param {import('http').Server} server
 */
function interuptHandle(server) {
  console.log('Terminating app')
  server.close()
}
const server = http.createServer(app.callback())
server.on('listening', function () {
  const address = server.address()
  console.log(
    `Listening on ${
      typeof address === 'string'
        ? address
        : `${address.address}:${address.port}`
    }`
  )
})
process.on('SIGTERM', () => interuptHandle(server))
process.on('SIGINT', () => interuptHandle(server))
server.listen(8080)
