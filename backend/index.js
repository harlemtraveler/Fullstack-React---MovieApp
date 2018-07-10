require('babel-core/register');

const fs = require('fs')
const os = require('os')
const Sequelize = require('sequelize')
const http = require('http')
const https = require('https')
const logger = require('now-logs')

const { dev } = require('./src/dev')
const { app } = require('./src/app')
const sockets = require('./src/sockets')
const { parseAndCacheRoutes } = require('./src/listroutes')

const PORT = parseInt(process.env.PORT) || 3456
const HOST = process.env.HOST || '0.0.0.0'

// database
const sequelize = require('./src/models')

if (dev) {
  parseAndCacheRoutes(app)
}

sequelize.sync()
.then(() => {
    // console.log("Starting in production mode")
    // now encrypts this for us
    let server = http.createServer(app.handle.bind(app))
    .listen(PORT, HOST, () => {
      console.log(`Express running at http://${HOST}:${PORT} (dev: ${dev})`);
        sockets(server)
        if (process.env.NOW_LOGS && !dev) {
          logger(process.env.NOW_LOGS)
        }
    })
    // try {
    //   let serverssl = https.createServer({
    //     key: fs.readFileSync('./key.pem'),
    //     cert: fs.readFileSync('./cert.pem')
    //   }, app.handle.bind(app)).listen(PORT+1, HOST, () => {
    //     sockets(serverssl)
    //     console.log(`Express running at https://${HOST}:${PORT+1} (${dev})`);
    //   })
    // } catch (error) {
    //   console.error('An error occurred with SSL', error)
    // }
})
.catch(err => {
  console.error('Error with sequelize', err);
})
