const request = require('request')

class EV3 {
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
    request.get({
      url: 'http://10.69.1.146:65240/forward'
    }, (err, res, body) => {
      if (err) {
        callback(err)
        return
      }

      callback()
    })
  }

  reverse(callback) {
    request.get({
      url: 'http://10.69.1.146:65240/back'
    }, (err, res, body) => {
      if (err) {
        callback(err)
        return
      }

      callback()
    })
  }

  stop(callback) {
    callback()
  }
}

module.exports = EV3
