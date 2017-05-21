const nxt = require('nodejs-nxt')

class NXT1Motor {
  constructor(nxt, motorByte) {
    this.nxt = nxt
    this.motorByte = motorByte
  }

  forward (callback) {
    this.nxt.SetOutputState(
      // port
      this.motorByte,
      // power
      100,
      // mode
      nxt.Mode.MotorOn,
      // regulationMode
      nxt.RegulationMode.MotorSpeed,
      // turnRatio
      0x00,
      // runState
      nxt.RunState.Running,
      // tachoLimit
      1000,
      // callback
      callback
    )
  }

  reverse (callback) {
    this.nxt.SetOutputState(
      // port
      this.motorByte,
      // power
      0x64,
      // mode
      nxt.Mode.MotorOn,
      // regulationMode
      nxt.RegulationMode.MotorSpeed,
      // turnRatio
      0x00,
      // runState
      nxt.RunState.Running,
      // tachoLimit
      [0x00, 0x00, 0x00, 0x00],
      // callback
      callback
    )
  }

  stop (callback) {
    this.nxt.SetOutputState(
      // port
      this.motorByte,
      // power
      0x00,
      // mode
      nxt.Mode.Brake,
      // regulationMode
      nxt.RegulationMode.Idle,
      // turnRatio
      0x00,
      // runState
      nxt.RunState.Running,
      // tachoLimit
      [0x00, 0x00, 0x00, 0x00],
      // callback
      callback
    )
  }
}

module.exports = NXT1Motor
NXT1Motor.MotorPort = nxt.MotorPort
