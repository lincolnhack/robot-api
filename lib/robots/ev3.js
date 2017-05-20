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
}

module.exports = EV3
