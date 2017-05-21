const async = require('async')
const request = require('request')

function createRobot(type, comport, callback) {
  comport = comport || 'COM0'
  request.post({
    url: 'http://localhost:5000/robots',
    json: {
      name: `${type}:${comport}`,
      type: type,
      comport
    }
  }, (err, res, body) => {
    if (err) {
      callback(err)
      return
    }

    if (res.statusCode !== 201) {
      callback(new Error(`Unexpected status code ${res.statusCode}`))
      console.log(body)
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

function leftRobot(robotId, callback) {
  console.log('turning left', robotId)
  request.post({
    url: `http://localhost:5000/robots/${robotId}/left`,
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

function rightRobot(robotId, callback) {
  console.log('turning right', robotId)
  request.post({
    url: `http://localhost:5000/robots/${robotId}/right`,
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

let nxt1_id = null
let nxt2_id = null
let ev3_id = null
let roomba_id = null

async.series([
  (cb) => async.parallel({
    // nxt1: async.apply(createRobot, 'nxt1', 'COM3'),
    // nxt2: async.apply(createRobot, 'nxt1', 'COM6'),
    // ev3: async.apply(createRobot, 'ev3', ''),
    roomba: async.apply(createRobot, 'roomba', ''),
  }, (err, results) => {
    if (err) {
      cb(err)
      return
    }

    nxt1_id = results.nxt1
    nxt2_id = results.nxt2
    ev3_id = results.ev3
    roomba_id = results.roomba

    cb()
  }),

  // (cb) => {
  //   console.log(`nxt1_id = ${nxt1_id}`)
  //   console.log(`nxt2_id = ${nxt2_id}`)
  //   console.log(`ev3_id = ${ev3_id}`)
  //   console.log(`roomba_id = ${roomba_id}`)
  //   cb()
  // },

  // async.apply(async.parallel, [
  //   (cb) => connectRobot(nxt1_id, cb),
  //   (cb) => connectRobot(nxt2_id, cb)
  // ]),

  // async.apply(async.parallel, [
  //   (cb) => beepRobot(nxt1_id, cb),
  //   (cb) => beepRobot(nxt2_id, cb)
  // ]),

  async.apply(async.parallel, [
    // (cb) => forwardRobot(nxt1_id, cb),
    // (cb) => forwardRobot(nxt2_id, cb),
    // (cb) => forwardRobot(ev3_id, cb),
    (cb) => forwardRobot(roomba_id, cb)
  ]),

  async.apply(async.parallel, [
    // (cb) => reverseRobot(nxt1_id, cb),
    // (cb) => reverseRobot(nxt2_id, cb),
    // (cb) => reverseRobot(ev3_id, cb),
    (cb) => reverseRobot(roomba_id, cb)
  ]),

  async.apply(async.parallel, [
    // (cb) => leftRobot(nxt1_id, cb),
    // (cb) => leftRobot(nxt2_id, cb),
    // (cb) => leftRobot(ev3_id, cb),
    (cb) => leftRobot(roomba_id, cb)
  ]),

  async.apply(async.parallel, [
    // (cb) => rightRobot(nxt1_id, cb),
    // (cb) => rightRobot(nxt2_id, cb),
    // (cb) => rightRobot(ev3_id, cb),
    (cb) => rightRobot(roomba_id, cb)
  ]),

], (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('we are done')
})

