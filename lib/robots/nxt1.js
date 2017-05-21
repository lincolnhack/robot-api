const { NXT, MotorPort } = require('nodejs-nxt')
const NXT1Motor = require('./nxt1motor')
const async = require('async')
const logger = require('../logger')

class NXT1 {
  constructor (portName) {
    this.NXT = new NXT(portName, true)
    this.connected = false

    this.queue = []

    this.MotorA = new NXT1Motor(this.NXT, MotorPort.A)
    this.MotorB = new NXT1Motor(this.NXT, MotorPort.B)

    this.keepAliveTimer = null
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

  queueKeepAlive() {
    const command = (cb) => {
      logger.info('keepalive-send')
      this.NXT.KeepAlive()
      this.keepAliveTimer = setTimeout(() => this.queueKeepAlive(), 5000)
      cb()
    }
    this.queueCommand(command)
  }

  stopKeepAlive() {
    clearTimeout(this.keepAliveTimer)
  }

  isConnected() {
    return this.connected
  }

  connect(callback) {
    const command = (cb) => {
      this.NXT.Connect((err) => {
        if (err) {
          this.connected = false
          return cb(err)
        }
        this.connected = true
        this.queueKeepAlive()
        cb()
      })
    }

    this.queueCommand(command)
    callback()
  }

  disconnect(callback) {
    const command = (cb) => {
      this.NXT.Disconnect((err) => {
        if (err) return cb(err)
        this.connected = false
        this.stopKeepAlive()
        cb()
      })
    }

    this.queueCommand(command)
    callback()
  }

  beep(callback) {
    const duration = 1000

    const command = (cb) => {
      logger.info('beep-start')
      this.NXT.PlayTone(1000, duration, (err) => {
        if (err) return cb(err)
        setTimeout(() => {
          logger.info('beep-stop')
          cb()
        }, duration)
      })
    }

    this.queueCommand(command)
    callback()
  }

  forward(callback) {
    const command = (cb) => {
      logger.info('forward-start')
      this.MotorA.forward()
      this.MotorB.forward()
      setTimeout(() => {
        logger.info('forward-stop')
        cb()
      }, 1000)
    }

    this.queueCommand(command)
    callback()
  }

  reverse(callback) {
    const command = (cb) => {
      logger.info('reverse-start')
      this.MotorA.reverse()
      this.MotorB.reverse()
      setTimeout(() => {
        logger.info('reverse-stop')
        cb()
      }, 1000)
    }

    this.queueCommand(command)
    callback()
  }

  left(callback) {
    const command = (cb) => {
      logger.info('left-start')
      this.MotorA.forward()
      this.MotorB.reverse()
      setTimeout(() => {
        logger.info('left-stop')
        cb()
      }, 1000)
    }

    this.queueCommand(command)
    callback()
  }

  right(callback) {
    const command = (cb) => {
      logger.info('right-start')
      this.MotorA.reverse()
      this.MotorB.forward()
      setTimeout(() => {
        logger.info('right-stop')
        cb()
      }, 1000)
    }

    this.queueCommand(command)
    callback()
  }
}

module.exports = NXT1
