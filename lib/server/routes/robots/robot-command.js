const Boom = require('boom')

function connect(reply, robot) {
  robot.connect((err) => {
    if (err) {
      return reply(Boom.badImplementation(err))
    }
    reply()
  })
}

function beep(reply, robot) {
  robot.beep((err) =>{
    if (err) {
      return reply(Boom.badImplementation(err))
    }
    reply()
  })
}

function disconnect(reply, robot) {
  robot.disconnect((err) =>{
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
    case 'disconnect': return disconnect(reply, robot.robot)
    case 'beep': return beep(reply, robot.robot)
    default: return reply(Boom.badRequest())
  }
}

module.exports = handler
