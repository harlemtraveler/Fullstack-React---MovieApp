// Ideas for https://github.com/lucasjellema/kafka-streams-running-topN/tree/master/kafka-node-express-topN-sse

// ... with this middleware:
function sseMiddleware(req, res, next) {
  res.sseConnection = new Connection(res);
  next();
}
exports.sseMiddleware = sseMiddleware;
/**
 * A Connection is a simple SSE manager for 1 client.
 */
class Connection {
  constructor(res) {
    this.res = res
  }

  setup() {
    this.res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'x-accel-buffering': 'no',
    })
  }

  send(data, topic) {
    if (topic) {
      this.res.write('event: ' + topic + '\n')
    }
    this.res.write('data: ' + JSON.stringify(data) + '\n\n')
  }
}
exports.Connection = Connection;
const identity = i => i
/**
 * A Topic handles a bundle of connections with cleanup after lost connection.
 */
class Topic {
  constructor({name, onConnect, onDisconnect}) {
    this.name = name
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
    this.connections = [];
  }

  connect(req, res) {
    let sseConn = res.sseConnection
    sseConn.setup()
    this.add(sseConn)
    this.onConnect && this.onConnect(sseConn, this.connections)
    return sseConn
  }

  send(msg, topic=this.name) {
    this.forEach(conn => conn.send(msg, topic))
  }

  add(conn) {
    var connections = this.connections;
    connections.push(conn);
    conn.res.on('close', function () {
      var i = connections.indexOf(conn);
      if (i >= 0) {
        connections.splice(i, 1);
      }
      this.onDisconnect && this.onDisconnect(conn, connections.length)
    });
  }

  forEach(fn) {
    this.connections.forEach(fn)
  }
}

exports.Topic = Topic;