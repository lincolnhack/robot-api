const request = require('request')

const moreton = '10.69.1.146'

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
      url: `http://${moreton}:65240/forward`
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
      url: `http://${moreton}:65240/back`
    }, (err, res, body) => {
      if (err) {
        callback(err)
        return
      }

      callback()
    })
  }

  left(callback) {
    request.get({
      url: `http://${moreton}:65240/left`
    }, (err, res, body) => {
      if (err) {
        callback(err)
        return
      }

      callback()
    })
  }

  right(callback) {
    request.get({
      url: `http://${moreton}:65240/right`
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
