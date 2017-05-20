const Boom = require('boom')
const NXT = require('../../../robots/nxt1')

function createNxt1(reply, robots, name, comport) {
  const robot = new NXT(comport)
  robots.push(robot)

  reply().code(201)
}

function handler(req, reply) {
  const { payload, server: { app: { robots } } } = req

  switch (payload.type) {
    case 'nxt1': return createNxt1(reply, robots, payload.name, payload.comport)
    case 'roomba': return reply('You want a roomba??')
    default: reply(Boom.badRequest('Not supported yet'))
  }
}

module.exports = handler