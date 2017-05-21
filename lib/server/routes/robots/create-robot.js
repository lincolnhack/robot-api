const Boom = require('boom')
const uuid = require('uuid/v4')
const NXT1 = require('../../../robots/nxt1')
const EV3 = require('../../../robots/ev3')
const ROOMBA = require('../../../robots/roomba')

function createNxt1(reply, robots, name, comport) {
  const robot = new NXT1(comport, true)

  const id = uuid()
  robots.push({ id, name, robot })

  reply({ id, name, connected: robot.isConnected() }).code(201)
}

function createEv3(reply, robots, name) {
  const robot = new EV3()
  const id = uuid()
  robots.push({ id, name, robot })

  reply({ id, name, connected: true }).code(201)
}

function createRoomba(reply, robots, name) {
  const robot = new ROOMBA()
  const id = uuid()
  robots.push({ id, name, robot })

  reply({ id, name, connected: true }).code(201)
}

function handler(req, reply) {
  const { payload, server: { app: { robots } } } = req

  switch (payload.type) {
    case 'nxt1': return createNxt1(reply, robots, payload.name, payload.comport)
    case 'ev3': return createEv3(reply, robots, payload.name)
    case 'roomba': return createRoomba(reply, robots, payload.name)
    default: reply(Boom.badRequest('Not supported yet'))
  }
}

module.exports = handler
