const Server = require('./server')
const Config = require('./config')
const pino = require('./logger')

const server = new Server(pino, Config)
server.start().then((info) => {
  pino.info(`Server started on port ${info.port}`)
  if (process.send !== undefined) {
    process.send('started')
  }
}).catch((err) => {
  pino.error('Server could not be started')
  pino.error(err)
  process.exit(1)
})
