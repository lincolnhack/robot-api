const Pino = require('pino')

const pino = Pino({
  prettyPrint: true,
  level: 'info',
})

module.exports = pino
