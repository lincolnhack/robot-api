const Joi = require('joi')

const createRobotHandler = require('./create-robot')
const getRobotsHandler = require('./get-robots')
const robotCommandHandler = require('./robot-command')

const register = (server, _, next) => {

  server.route({
    method: 'POST',
    path: '/robots',
    handler: createRobotHandler,
    config: {
      validate: {
        payload: Joi.object().keys({
          name: Joi.string().required(),
          type: Joi.only('nxt1', 'ev3', 'roomba').required(),
          comport: Joi.string()
        })
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/robots',
    handler: getRobotsHandler
  })

  server.route({
    method: 'POST',
    path: '/robots/{robotId}/{command}',
    handler: robotCommandHandler,
    config: {
      validate: {
        params: {
          robotId: Joi.string(),
          command: Joi.only('connect', 'forward', 'reverse', 'beep', 'disconnect', 'left', 'right')
        }
      }
    }
  })

  next()
}

register.attributes = {
  name: 'robots-routes',
  version: '0.0.0',
}

module.exports.register = register
