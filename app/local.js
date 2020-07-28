// @ts-check
const http = require('http')
const dotenv = require('dotenv')
dotenv.config()

const app = require('./web')

/**
 *
 * @param {import('http').Server} server
 */
function interuptHandle(server) {
  console.log('Terminating app')
  server.close()
}

const instance = app()
const server = http.createServer(instance.callback())
server.on('listening', function () {
  const address = server.address()
  console.log(
    `Listening on ${
      typeof address === 'string'
        ? address
        : `${address && address.address}:${address && address.port}`
    }`
  )
})
process.on('SIGTERM', () => interuptHandle(server))
process.on('SIGINT', () => interuptHandle(server))
server.listen(8080)
