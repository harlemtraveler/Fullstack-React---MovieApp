#!/usr/bin/env node
const _ = require('lodash')
const fs = require('fs')
const { app } = require('./app')
const jsdoc = require.resolve('jsdoc/jsdoc.js')
const spawn = require('child_process').spawn

const parseDoc = (file) => {
  return new Promise((resolve, reject) => {
    const child = spawn('jsdoc', ["-t", "templates/haruki", "-d", "console", file], { cwd: process.cwd() })

    let str = []
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    /* istanbul ignore next */
    child.stdout.on('data', function (data) {
      str.push(data)
    });
    child.on('close', function (code) {
      if (code === 0) {
        const out = str.join('\n')
        const json = JSON.parse(out)
        resolve(json)
      } else {
        reject("Error", code);
      }
    });
  })
}

const parsePath = (layer) => {
  if (layer.path) { return layer.path }
  else if (layer.route && layer.route.path) { return layer.route.path }
  else if (layer.regexp) {
    if (layer.regexp.source === '^\\/?$') {
      return '/'
    } else if (layer.regexp.source === '^\\/?(?=\\/|$)') {
      return '*'
    } else {
      return `${layer.regexp.source}`
    }
  }
}

const parseMethod = (layer) => {
  if (layer.method) return layer.method;
  else if (layer.route) {
    if (layer.route.methods) {
      return _.keys(layer.route.methods)
    } else if (layer.route.method) {
      return layer.route.method
    }
  }
}

function parseRoute(route) {
  if (!route.stack && !(route.route && route.route.stack)) {
    if (route.handle.stack) {
      return parseRoute(route.handle)
    }
  } else {
    const path = parsePath(route)
    const method = parseMethod(route)

    return {
      method: method,
      path: path
    }
  }
}

function routePerMethod(route) {
  return route.method
          .map(m => {
            return Object.assign({}, route, { method: m.toUpperCase() })
          })
}

function parseRoutes(app) {
  return new Promise((resolve, reject) => {
    const router = app._router;
    const parsedRoutes = _.map(router.stack, r => parseRoute(r))
                          // .map(r => routePerMethod(r))
    const routes = _.flatten(_.compact(parsedRoutes).map(r => routePerMethod(r)))
    console.log(routes)
    return parseDoc('./app.js')
    .then(data => {
      const { functions } = data
      const pathsToDoc = functions.reduce((sum, f) => {
        sum[f.name] = f;
        return sum
      }, {});
      const updatedRoutes = routes.map(route => {
        const doc = pathsToDoc[`${route.method} ${route.path}`];
        if (doc) {
          if (doc.access === "private") {
            return null;
          } else {
            route.desc = doc['description']
            route.examples = doc['examples']
          }
        }
        return route
      })
      return resolve(updatedRoutes)
    })
    .catch(reject)
    // return routes
  })
}

function writeRoutes(routes) {
  return fs.writeFileSync("./routes.json", JSON.stringify(routes))
}

function parseAndCacheRoutes(app) {
  return parseRoutes(app)
          .then(r => writeRoutes(r))
}

const _getRoutes = () => require('./routes.json')
function listRoutes(app) {
  return new Promise(resolve => {
    const routes = _getRoutes()
    resolve(routes)
  })
}

module.exports = listRoutes
module.exports.parseAndCacheRoutes = parseAndCacheRoutes