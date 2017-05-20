const nxtlib = require('./nxtlib')

class Motor {
  constructor (NXT, motorByte) {
    this.NXT = NXT
    this.motorByte = motorByte
  }

  start (callback) {
    if (!this.NXT.isConnected()) {
      callback(new Error('start failed: NXT is not connected'))
      return
    }

    nxtlib.setOutputState(this.NXT.serialPort, {
      port: this.motorByte,
      runState: nxtlib.runStates.RUNNING,
      power: 0x9C,
      mode: nxtlib.modes.MOTORON
    }, () => callback(null))
  }

  reverse (callback) {
    if (!this.NXT.isConnected()) {
      callback(new Error('reverse failed: NXT is not connected'))
      return
    }

    nxtlib.setOutputState(this.NXT.serialPort, {
      port: this.motorByte,
      runState: nxtlib.runStates.RUNNING,
      power: 0x64,
      mode: nxtlib.modes.MOTORON
    }, () => callback(null))
  }

  stop (callback) {
    if (!this.NXT.isConnected()) {
      callback(new Error('stop failed: NXT is not connected'))
      return
    }

    nxtlib.setOutputState(this.NXT.serialPort, {
      port: this.motorByte,
      power: 0x00,
      mode: nxtlib.modes.MOTOROFF,
      regulationMode: nxtlib.regulationModes.IDLE
    }, () => callback(null))
  }
}

module.exports = Motor
