const Joi = require('joi')

const createRobotHandler = require('./create-robot')
const getRobotsHandler = require('./get-robots')

const register = (server, _, next) => {

  server.route({
    method: 'POST',
    path: '/robots',
    handler: createRobotHandler,
    config: {
      validate: {
        payload: Joi.object().keys({
          name: Joi.string().required(),
          type: Joi.only('nxt1', 'nxtev3', 'roomba').required(),
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

  next()
}

register.attributes = {
  name: 'robots-routes',
  version: '0.0.0',
}

module.exports.register = register
