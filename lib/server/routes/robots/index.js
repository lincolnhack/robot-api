const register = (server, _, next) => {

  server.route({
    method: 'GET',
    path: '/robots',
    handler: (req, reply) => {
      reply('Hello World')
    }
  })

  next()
}

register.attributes = {
  name: 'robots-routes',
  version: '0.0.0',
}

module.exports.register = register
