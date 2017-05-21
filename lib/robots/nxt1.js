const { NXT } = require('nodejs-nxt')
const NXT1Motor = require('./nxt1motor')
const async = require('async')
const logger = require('../logger')

const MotorPort = {
  A: 0x00,
  B: 0x01,
  C: 0x02,
  AB: 0x03,
  AC: 0x04,
  BC: 0x05
}

class NXT1 {
  constructor (portName) {
    this.NXT = new NXT(portName, true)
    this.connected = false

    this.queue = []

    this.MotorA = new NXT1Motor(this.NXT, MotorPort.A)
    this.MotorB = new NXT1Motor(this.NXT, MotorPort.B)
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
        this.MotorA.stop()
        this.MotorB.stop()
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
        this.MotorA.stop()
        this.MotorB.stop()
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
        this.MotorA.stop()
        this.MotorB.stop()
        cb()
      }, 700)
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
        this.MotorA.stop()
        this.MotorB.stop()
        cb()
      }, 700)
    }

    this.queueCommand(command)
    callback()
  }
}

module.exports = NXT1
