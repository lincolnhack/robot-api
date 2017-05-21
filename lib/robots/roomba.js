const request = require('request')
const logger = require('../logger')

class ROOMBA {
  constructor (portName) {
    this.queue = []
  }

  queueCommand(command) {
    this.queue.push(command)

    if (this.queueRunning === true) return
    this.queueRunning = true

    logger.info('queue starting')
    this.nextCommand()
  }

  nextCommand() {
    logger.info(`nextCommand - this.queue.length = ${this.queue.length}`)
    if (this.queue.length === 0) {
      logger.info('queue stopped')
      this.queueRunning = false
      return
    }
    const command = this.queue.shift()
    process.nextTick(() => command((err) => {
      if (err) logger.error(err)
      this.nextCommand()
    }))
  }

  isConnected() {
    return true
  }

  connect(callback) {
    callback()
  }

  disconnect(callback) {
    callback()
  }

  beep(callback) {
    callback()
  }

  forward(callback) {
    const command = (cb) => {
      logger.info('forward-start')
      request.get({
        url: 'http://10.69.6.96/command.json?command=forward&' + new Date().getTime()
      }, (err, res, body) => {
        if (err) return cb(err)
        if (res.statusCode !== 200) return cb(new Error(`Roomba sent back ${res.statusCode}`))
        setTimeout(() => {
          logger.info('forward-stop')
          cb()
        }, 1000)
      })
    }

    this.queueCommand(command)
    callback()
  }

  reverse(callback) {
    callback()
  }

  left(callback) {
    const command = (cb) => {
      logger.info('left-start')
      request.get({
        url: 'http://10.69.6.96/command.json?command=spinleft&' + new Date().getTime()
      }, (err, res, body) => {
        if (err) return cb(err)
        if (res.statusCode !== 200) return cb(new Error(`Roomba sent back ${res.statusCode}`))
        setTimeout(() => {
          logger.info('left-stop')
          cb()
        }, 1000)
      })
    }

    this.queueCommand(command)
    callback()
  }

  right(callback) {
    const command = (cb) => {
      logger.info('right-start')
      request.get({
        url: 'http://10.69.6.96/command.json?command=spinright&' + new Date().getTime()
      }, (err, res, body) => {
        if (err) return cb(err)
        if (res.statusCode !== 200) return cb(new Error(`Roomba sent back ${res.statusCode}`))
        setTimeout(() => {
          logger.info('right-stop')
          cb()
        }, 1000)
      })
    }

    this.queueCommand(command)
    callback()
  }

  stop(callback) {
    callback()
  }
}

module.exports = ROOMBA
