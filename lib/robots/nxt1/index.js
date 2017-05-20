const SerialPort = require('serialport')
const { EventEmitter } = require('events')
const Motor = require('./motor')
const logger = require('../../logger')
const nxtlib = require('./nxtlib')

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
    return this.serialPort !== null
  }

  setupSerialPort() {
    const serialPort = new SerialPort(this.comport)

    serialPort.on('error', this.onSerialPortError.bind(this, serialPort))
    serialPort.on('data', this.onSerialPortData.bind(this, serialPort))
    serialPort.on('close', this.onSerialPortClose.bind(this, serialPort))
    serialPort.on('open', this.onSerialPortOpen.bind(this, serialPort))
    serialPort.on('end', this.onSerialPortEnd.bind(this, serialPort))

    return serialPort
  }

  onSerialPortData(serialPort, data) {
    serialPort.lastData = data

    const responseData = data.slice(2)
    logger.info('data received (%d bytes): ', responseData.length, responseData)

    var dataHeader = data.slice(0, 2)
    logger.info('data header (%d bytes): ', dataHeader.length, dataHeader)

    if (responseData[2] > 0) {
      logger.info('Error in response: %d', responseData[2])
    }

    this.emit('data', data)
  }

  onSerialPortOpen(serialPort) {
    this.serialPort = serialPort

    logger.info('openned %s', this.comport)
    this.emit('connect')
  }

  onSerialPortClose(serialPort) {
    if (this.serialPort !== serialPort) return

    this.serialPort = null

    logger.info('closed connection to %s', this.comport)
    this.emit('disconnect')
  }

  onSerialPortError(serialPort, err) {
    if (this.serialPort !== serialPort) return

    this.serialPort = null

    logger.error("SerialPort error: ", err)
    this.emit('error', err)
  }

  onSerialPortEnd(serialPort) {
    if (this.serialPort !== serialPort) return

    this.serialPort = null

    logger.info("SerialPort connection ended")
    this.emit('end')
  }

  keepAlive() {
    if (this.serialPort === null) return

    this.lastData = null
    logger.info("sending keepalive")
    nxtlib.keepAlive(this.serialPort, () => {})

    this.keepAliveTimer = setTimeout(() => {
      if (this.serialPort === null) return

      if (this.lastData === null) {
        logger.info("keepAlive: connection lost")
        this.serialPort.close()
        return
      }
      this.keepAlive()
    }, 5000)
  }

  connect(callback) {
    if (this.serialPort !== null) {
      callback(new Error('unable to connect, NXT is already connected'))
      return
    }

    logger.info('opening %s...', this.comport)

    const serialPort = this.setupSerialPort()

    serialPort.open((err) => {
      if (err) {
        callback(new Error(`connection error: ${err}`))
        this.emit('error', err)
        return
      }

      logger.info('serialport %s opened', this.comport)
      this.keepAlive()
      callback()
    })
  }

  disconnect(callback) {
    if (this.serialPort === null) {
      callback(new Error('unable to disconnect, NXT is not connected'))
      return
    }

    this.serialPort.close(callback)
  }

  playtone(frequency, duration, callback) {
    if (this.serialPort === null) {
      callback(new Error('unable to playtone, NXT is not connected'))
      return
    }

    nxtlib.playtone(this.serialPort, frequency, duration, callback)
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
    if (this.serialPort === null) {
      callback(new Error('unable to allStop, NXT is not connected'))
      return
    }

    nxtlib.setOutputState(this.serialPort, {
      port: nxtlib.ports.MOTOR_ALL,
      power: 0x00,
      mode: nxtlib.modes.BRAKE,
      regulationMode: nxtlib.regulationModes.IDLE
    }, callback)
  }
}

module.exports = NXT
