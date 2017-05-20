const async = require('async')
const request = require('request')

function createRobot(comport, callback) {
  request.post({
    url: 'http://localhost:5000/robots',
    json: {
      name: "cword",
      type: "nxt1",
      comport
    }
  }, (err, res, body) => {
    if (err) {
      callback(err)
      return
    }

    if (res.statusCode !== 201) {
      callback(new Error(`Unexpected status code ${res.statusCode}`))
      return
    }

    callback(null, body.id)
  })
}

function connectRobot(robotId, callback) {
  console.log('connecting', robotId)
  request.post({
    url: `http://localhost:5000/robots/${robotId}/connect`,
    json: true
  }, (err, res, body) => {
    if (err) {
      callback(err)
      return
    }

    if (res.statusCode !== 200) {
      callback(new Error(`Unexpected status code ${res.statusCode}`))
      return
    }

    callback(null, robotId)
  })
}

function beepRobot(robotId, callback) {
  console.log('beeping', robotId)
  request.post({
    url: `http://localhost:5000/robots/${robotId}/beep`,
    json: true
  }, (err, res, body) => {
    if (err) {
      callback(err)
      return
    }

    if (res.statusCode !== 200) {
      callback(new Error(`Unexpected status code ${res.statusCode}`))
      return
    }

    callback(null, robotId)
  })
}

function forwardRobot(robotId, callback) {
  console.log('forwarding', robotId)
  request.post({
    url: `http://localhost:5000/robots/${robotId}/forward`,
    json: true
  }, (err, res, body) => {
    if (err) {
      callback(err)
      return
    }

    if (res.statusCode !== 200) {
      callback(new Error(`Unexpected status code ${res.statusCode}`))
      return
    }

    callback(null, robotId)
  })
}

function reverseRobot(robotId, callback) {
  console.log('reversing', robotId)
  request.post({
    url: `http://localhost:5000/robots/${robotId}/reverse`,
    json: true
  }, (err, res, body) => {
    if (err) {
      callback(err)
      return
    }

    if (res.statusCode !== 200) {
      callback(new Error(`Unexpected status code ${res.statusCode}`))
      return
    }

    callback(null, robotId)
  })
}

function stopRobot(robotId, callback) {
  console.log('stopping', robotId)
  request.post({
    url: `http://localhost:5000/robots/${robotId}/stop`,
    json: true
  }, (err, res, body) => {
    if (err) {
      callback(err)
      return
    }

    if (res.statusCode !== 200) {
      callback(new Error(`Unexpected status code ${res.statusCode}`))
      return
    }

    callback(null, robotId)
  })
}

function disconnectRobot(robotId, callback) {
  console.log('disconnecting', robotId)
  request.post({
    url: `http://localhost:5000/robots/${robotId}/disconnect`,
    json: true
  }, (err, res, body) => {
    if (err) {
      callback(err)
      return
    }

    if (res.statusCode !== 200) {
      callback(new Error(`Unexpected status code ${res.statusCode}`))
      return
    }

    callback(null, robotId)
  })
}

async.waterfall([
  async.apply(createRobot, 'COM4'),
  async.apply(connectRobot),
  async.apply(beepRobot),
  async.apply(forwardRobot),
  async.apply(reverseRobot),
  async.apply(stopRobot),
  async.apply(disconnectRobot)
], (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('we are done')
})
