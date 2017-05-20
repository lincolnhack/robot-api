const async = require('async')
const request = require('request')

function createRobot(comport, callback) {
  request.post({
    url: 'http://localhost:5000/robots',
    json: {
      name: "cword",
      type: "nxt1",
      comport: "COM4"
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

    callback()
  })
}

async.waterfall([
  async.apply(createRobot, 'COM4'),
  async.apply(connectRobot)
], (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('did it')
})
