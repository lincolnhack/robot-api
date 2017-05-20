const { NXT } = require('nodejs-nxt')
const NXT1Motor = require('./nxt1motor')
const async = require('async')

class NXT1 {
  constructor (portName) {
    this.NXT = new NXT(portName, true)
    this.connected = false

    this.MotorA = new NXT1Motor(this.NXT, NXT1Motor.MotorPort.A)
    this.MotorB = new NXT1Motor(this.NXT, NXT1Motor.MotorPort.B)
    this.MotorC = new NXT1Motor(this.NXT, NXT1Motor.MotorPort.C)
  }

  isConnected() {
    return this.connected
  }

  connect(callback) {
    this.NXT.Connect((err) => {
      if (err) {
        this.connected = false
        return callback(err)
      }
      this.connected = true
      callback()
    })
  }

  disconnect(callback) {
    this.NXT.Disconnect((err) => {
      if (err) {
        return callback(err)
      }
      this.connected = false
      callback()
    })
  }

  beep(callback) {
    this.NXT.PlayTone(1000, 2000, (err) => {
      if (err) {
        return callback(err)
      }
      callback()
    })
  }

  forward(callback) {
    this.MotorA.forward()
    this.MotorB.forward()
    setTimeout(() => callback(), 1000)
  }

  reverse(callback) {
    this.MotorA.reverse()
    this.MotorB.reverse()
    setTimeout(() => callback(), 1000)
  }

  stop(callback) {
    this.MotorA.stop()
    this.MotorB.stop()
    callback()
  }
}

module.exports = NXT1
