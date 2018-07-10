
module.exports = (fn) => {
  let timerId
  // Handle timer
  const tickTimer = function() {
    timerId = setTimeout(function() {
      fn(new Date())
      tickTimer()
    }, 1000)
    return timerId
  }
  
  return tickTimer
}