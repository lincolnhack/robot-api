const request = require('request')
const logger = require('../logger')

const moreton = '10.69.1.146'

class EV3 {
  constructor() {
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
        url: `http://${moreton}:65240/forward`
      }, (err, res, body) => {
        if (err) return cb(err)
        if (res.statusCode !== 200) return cb(new Error(`Moreton sent back ${res.statusCode}`))
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
    const command = (cb) => {
      logger.info('reverse-start')
      request.get({
        url: `http://${moreton}:65240/back`
      }, (err, res, body) => {
        if (err) return cb(err)
        if (res.statusCode !== 200) return cb(new Error(`Moreton sent back ${res.statusCode}`))
        setTimeout(() => {
          logger.info('forward-stop')
          cb()
        }, 1000)
      })
    }

    this.queueCommand(command)
    callback()
  }

  left(callback) {
    const command = (cb) => {
      logger.info('left-start')
      request.get({
        url: `http://${moreton}:65240/left`
      }, (err, res, body) => {
        if (err) return cb(err)
        if (res.statusCode !== 200) return cb(new Error(`Moreton sent back ${res.statusCode}`))
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
        url: `http://${moreton}:65240/right`
      }, (err, res, body) => {
        if (err) return cb(err)
        if (res.statusCode !== 200) return cb(new Error(`Moreton sent back ${res.statusCode}`))
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

module.exports = EV3
