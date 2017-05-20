const Boom = require('boom')

function handler(req, reply) {
  const { params: { robotId }} = req
  reply(`you wanna command? ${robotId}`)
}

module.exports = handler
