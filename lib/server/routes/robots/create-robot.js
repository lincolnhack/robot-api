const Boom = require('boom')
const Robots = require('../../../robots')

function createNxt1(reply, name, comport) {
  reply(`You want an nxt1?? ${name} ${comport}`)
}

function handler(req, reply) {
  const { payload } = req

  switch (payload.type) {
    case 'nxt1': return createNxt1(reply, payload.name, payload.comport)
    case 'roomba': return reply('You want a roomba??')
    default: reply(Boom.badRequest('Not supported yet'))
  }
}

module.exports = handler
