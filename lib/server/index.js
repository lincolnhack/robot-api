const Hapi = require('hapi')
const HapiPino = require('hapi-pino')
const { Logger } = require('pino')

const Routes = require('./routes')

class Server {
  constructor(pino, config) {
    this.server = new Hapi.Server()
    this.plugins = [{
      register: HapiPino,
      options: {
        prettyPrint: config.node_env === 'dev',
        instance: pino,
      },
    }]

    this.server.app.config = config
    this.server.app.robots = []
  }

  start() {
    const { config } = this.server.app
    this.server.connection({
      port: config.server.port,
      routes: {
        cors: true
      }
    })

    return this.server.register([...this.plugins, ...Routes])
      .then(() => this.server.start())
      .then(() => this.server.info)
  }

  stop() {
    return this.server.stop()
  }
}

module.exports = Server
