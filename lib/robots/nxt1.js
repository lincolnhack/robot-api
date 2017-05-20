const { NXT } = require('nodejs-nxt')

class NXT1 {
  constructor (portName) {
    this.NXT = new NXT(portName, true)
    this.connected = false
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
}

module.exports = NXT1
