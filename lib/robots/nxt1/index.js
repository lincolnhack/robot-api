const SerialPort = require('serialport')
const { EventEmitter } = require('events')
const Motor = require('./motor')

class NXT extends EventEmitter {
  constructor(comport, logger) {
    super()

    this.comport = comport
    this.logger = logger

    this.lastData = null

    this.serialPort = null

    this.motorA = new Motor(this, nxtlib.ports.MOTOR_A)
    this.motorB = new Motor(this, nxtlib.ports.MOTOR_B)
  }

  isConnected() {
    return this.serialPort === null
  }

  setupSerialPort() {
    var serialPort = new SerialPort(this.comport)

    serialPort.NXT = this

    serialPort.on('error', handleErrorEvent)
    serialPort.on('data', handleDataEvent)
    serialPort.on('close', handleCloseEvent)
    serialPort.on('open', handleOpenEvent)
    serialPort.on('end', handleEndEvent)

    return serialPort
  }

  keepAlive() {
    var $this = this

    if (this.serialPort != null) {

      this.lastData = null
      nxtlib.keepAlive(this.serialPort)

      this.keepAliveTimer = setTimeout(function () {
        if ($this.serialPort != null) {
          if ($this.lastData == null) {
            debug("connection lost")
            $this.serialPort.close()
            return
          }
          $this.keepAlive()
        }
      }, 5000)
    }
  }

  connect(callback) {
    var $this = this

    if (this.serialPort != null) {
      debug('unable to connect, NXT is already connected')
      return
    }

    debug('openning %s...', this.comport)

    var serialPort = this.setupSerialPort()

    serialPort.open(function (err) {
      if (err) {
        debug("connection error: %s", err)
        $this.emit('error', err)
      }

      utils.doCallback(callback, err)

      if (!err)
        $this.keepAlive()
    })
  }

  disconnect(callback) {
    if (this.serialPort == null) {
      debug('unable to disconnect, NXT is not connected')
      return
    }

    this.serialPort.close(function () {
      utils.doCallback(callback)
    })
  }

  playtone(frequency, duration, callback) {
    if (this.serialPort == null) {
      debug('unable to playtone, NXT is not connected')
      return
    }

    nxtlib.playtone(this.serialPort, frequency, duration, function () {
      utils.doCallback(callback)
    })
  }

  startMotorA(callback) {
    this.motorA.start(callback)
  }

  startMotorAReverse(callback) {
    this.motorA.reverse(callback)
  }

  stopMotorA(callback) {
    this.motorA.stop(callback)
  }

  startMotorB(callback) {
    this.motorB.start(callback)
  }

  startMotorBReverse(callback) {
    this.motorB.reverse(callback)
  }

  stopMotorB(callback) {
    this.motorB.stop(callback)
  }

  allStop(callback) {
    if (this.serialPort == null) {
      debug('unable to allStop, NXT is not connected')
      return
    }

    nxtlib.setOutputState(this.serialPort, {
      port: nxtlib.ports.MOTOR_ALL,
      power: 0x00,
      mode: nxtlib.modes.BRAKE,
      regulationMode: nxtlib.regulationModes.IDLE
    }, function () {
      utils.doCallback(callback)
    })
  }
}

module.exports = NXT
