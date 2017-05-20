const Boom = require('boom')

function connect(reply, robot) {
  robot.connect((err) => {
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

function beep(reply, robot) {
  robot.beep((err) =>{
    if (err) {
      return reply(Boom.badImplementation(err))
    }
    reply()
  })
}

function forward(reply, robot) {
  robot.forward((err) =>{
    if (err) {
      return reply(Boom.badImplementation(err))
    }
    reply()
  })
}

function reverse(reply, robot) {
  robot.reverse((err) =>{
    if (err) {
      return reply(Boom.badImplementation(err))
    }
    reply()
  })
}

function left(reply, robot) {
  robot.left((err) =>{
    if (err) {
      return reply(Boom.badImplementation(err))
    }
    reply()
  })
}

function right(reply, robot) {
  robot.right((err) =>{
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
    case 'forward': return forward(reply, robot.robot)
    case 'reverse': return reverse(reply, robot.robot)
    case 'left': return left(reply, robot.robot)
    case 'right': return right(reply, robot.robot)
    default: return reply(Boom.badRequest())
  }
}

module.exports = handler
