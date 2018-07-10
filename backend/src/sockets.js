const timer = require('./channels/timer')

module.exports = (
  server
) => {
  const io = require('socket.io')(server)
  io.set('origins', '*:*');
  
  let numClients = 0

  // Timer app
  var iotimer = io.of('/time');
  const startTimer = timer(date => iotimer.emit('tick', JSON.stringify({date})))
  startTimer() // start
  iotimer.on('connection', function(socket){  
    console.log('Connected to timer namespace');
  });
  iotimer.emit('stats', { data: 'some data' });  
  
  io.on('connection', (socket) => {
    numClients++;
    console.log('Connected', numClients);
    socket.emit('stats', { numClients });

    socket.on('disconnect', function() {
        numClients--;
        io.emit('stats', { numClients });
    });
  })

  return io
}