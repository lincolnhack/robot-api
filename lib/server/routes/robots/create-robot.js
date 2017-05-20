const Boom = require('boom')
const uuid = require('uuid/v4')
const NXT1 = require('../../../robots/nxt1')

function createNxt1(reply, robots, name, comport) {
  const robot = new NXT1(comport, true)

  const id = uuid()
  robots.push({ id, name, robot })

  reply({ id, name, connected: robot.isConnected() }).code(201)
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


/*

var nxt = require('nodejs-nxt');
var nxt0 = new nxt.NXT('COM4', true);

nxt0.Connect(function(error) {
  if (error) {
    console.log('Could not connect to the device!');
  } else {
    nxt0.PlayTone(1000, 2000, function(error) {
      if (error) {
        console.log('Could not play the tone!');
      }

      nxt0.Disconnect();
    });
  }
});


*/
