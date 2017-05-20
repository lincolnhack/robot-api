const Boom = require('boom')

function handler(req, reply) {
  const { server: { app: { robots } } } = req

  const result = robots.map(({ id, name, robot }) => ({
    id,
    name,
    connected: robot.isConnected()
  }))

  reply(result)
}

module.exports = handler
