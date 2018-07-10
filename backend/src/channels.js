const tickTimer = require('./channels/timer')
const sseMw = require('./channels/sse')

let timerId
const onConnect = (conn, count) => {
  if (!timerId) {
    const startTimer = tickTimer(data => {
      timerChannel.send({date: new Date()})
    })
    timerId = startTimer()
  }
}

const onDisconnect = (conn, count) => {
  if (count < 1) {
    timerId && clearTimeout(timerId)
    timerId = null
  }
}

const timerChannel = new sseMw.Topic({
  name: 'tick_time',
  onConnect,
  onDisconnect
});

// Channels
module.exports = {
  timer: timerChannel
}