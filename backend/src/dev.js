require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV || 'development'
const dev = NODE_ENV === 'development'
module.exports.dev = dev