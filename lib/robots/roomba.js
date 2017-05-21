const request = require('request')

class ROOMBA {
  constructor (portName) {
    this.queue = []
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
      request.get({
        url: 'http://10.69.6.96/command.json?command=forward&' + new Date().getTime()
      }, (err, res, body) => {
        if (err) {
          cb(err)
          return
        }

        cb()
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
      request.get({
        url: 'http://10.69.6.96/command.json?command=spinleft&' + new Date().getTime()
      }, (err, res, body) => {
        if (err) {
          cb(err)
          return
        }

        cb()
      })
    }

    this.queueCommand(command)
    callback()
  }

  right(callback) {
    const command = (cb) => {
      request.get({
        url: 'http://10.69.6.96/command.json?command=spinright&' + new Date().getTime()
      }, (err, res, body) => {
        if (err) {
          cb(err)
          return
        }

        cb()
      })
    }

    this.queueCommand(command)
    callback()
  }

  stop(callback) {
    callback()
  }

  queueCommand(command) {
    this.queue.push(command)

    if (this.queueRunning === true) return
    this.queueRunning = true

    this.nextCommand()
  }

  nextCommand() {
    if (this.queue.length === 0) {
      this.queueRunning = false
      return
    }
    const command = this.queue.shift()
    process.nextTick(() => command((err) => {
      this.nextCommand()
    }))
  }
}

module.exports = ROOMBA
