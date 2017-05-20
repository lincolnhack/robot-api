const Boom = require('boom')

function connect(reply, robot) {
  robot.connect((err) => {
    if (err) {
      return reply(Boom.badImplementation(err))
    }
    reply()
  })
}

function handler(req, reply) {
  const { params: { robotId, command }, server: { app: { robots } } } = req
  const robot = robots.find(({ id }) => robotId === id)

  if (!robot) {
    reply(Boom.notFound())
    return
  }

  switch (command) {
    case 'connect': return connect(reply, robot.robot)
    default: return reply(Boom.badRequest())
  }
}

module.exports = handler
