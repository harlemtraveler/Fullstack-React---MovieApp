const Sequelize = require('sequelize')
const { dev } = require('./dev')
const os = require('os')

// database
const sequelize = new Sequelize('users', 'admin', 'admin', {
  dialect: 'sqlite',
  storage: dev ? './db.sqlite' : `${os.tmpdir()}/db.sqlite`
})

// Users
const User = sequelize.define('user', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV1,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING
  },
  lastLogin: {
    type: Sequelize.DATE,
  },
  zipcode: {
    type: Sequelize.STRING,
  },
})

const Movie = sequelize.define('movie', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV1,
    primaryKey: true
  },
  api_id: {
    type: Sequelize.STRING
  },
  details: {
    type: Sequelize.TEXT,
  }
})

const UserMovies = sequelize.define('user_movies', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV1,
    primaryKey: true
  }
})

User.hasMany(Movie)
// Movie.belongsToMany(User, { through: UserMovies })

module.exports = sequelize
module.exports.User = User
module.exports.Movie = Movie
module.exports.UserMovies = UserMovies