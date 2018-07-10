const bcrypt = require('bcrypt')
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const boom = require('express-boom')
const validate = require('validate.js')
const cors = require('cors')
const channels = require('./channels')

const passport = require("passport");
const passportJWT = require("passport-jwt");
const request = require('request')
const MovieDB = require('moviedb');
const memoize = require('memoizee');
const memProfile = require('memoizee/profile');

const listRoutes = require('./listroutes')
const sseMW = require('./channels/sse')

const { dev } = require('./dev')

import { Movie, User, UserMovie } from './models'

const {
  Strategy,
  ExtractJwt,
} = require('passport-jwt')
const JwtStrategy = Strategy

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY
const MOVIE_BASE_URL = `https://api.themoviedb.org/3`

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromHeader('Authorization'),
  ExtractJwt.fromAuthHeader(),
  ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
]);
jwtOptions.secretOrKey = 'something_secret';

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  User.findOne({ where: { uuid: jwt_payload.uuid } })
  .then(user => next(null, user))
  .catch(err => next(null, false))
});

passport.use(strategy);

const app = express();
app.use(passport.initialize());

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json())
app.use(boom())
app.use(cors({
  // CORS config
  origins: [ '*' ]
}))
app.use(sseMW.sseMiddleware)

app.get("/", function(req, res) {
  res.json({
    message: "Login server"
  });
});

const constraints = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
    length: {
      minimum: 3,
      message: 'Too short'
    }
  }
}

/**
 * @desc Get the current time on the server
 * @function GET /time
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
const getCurrentTime = (req, res) => {
  const time = new Date()
  res
    .status(200)
    .json({ time })
}

/**
 * @desc Subscribe to time updates
 * @function GET /time/subscribe
 * @param {express.Request} req The request object
 * @param {express.Response} res The response object
 */
const subscribeCurrentTime = (req, res) => {
  console.log('subscribeCurrentTime called', typeof req, typeof res)
  channels.timer.connect(req, res)
}

/**
 * @desc List all the available routes
 * @function GET /routes
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
const listRoutesRoute = (req, res) => {
  listRoutes(app)
  .then(routes => {
    res
      .status(200)
      .json({ routes })
  })
  .catch(err => {
    console.log('listRoutesRoute error', err)
  })
}

/**
 * @desc Reset the working Database
 * @function GET /_reset
 * @access private
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
const resetDB = (req, res) => {
  User.destroy({
    truncate: true,
  })
  .then(() => {
    res.json({'status': 'success'})
  })
}

/**
 * @desc Signup on the server
 * @function POST /signup
 * @example
 *  curl \
    -H "Accept: application/json" \
    -H "Content-type: application/json" \
    -XPOST \
    -d $DATA $URL/signup
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
const signup = (req, res) => {
  validate.async(req.body, constraints, { format: 'grouped' })
  .then(() => {
    const { email, password } = req.body;
    // Check if the user exists
    User.findOne({ where: { email }})
    .then(user => {
      if (user) {
        console.log('user ->', user)
        return res.boom.badRequest('Email has already been taken');
      }

      bcrypt.hash(password, SALT_ROUNDS)
      .then(hash => {
        User
          .build({ email, password: hash })
          .save()
          .then(user => {
            res.json({
              'status': 'success'
            })
          })
          .catch(err => {
            res.boom.badImplementation(err)
          });

      })
      .catch(err => {
        console.log('err ->', err);
        res.boom.badImplementation(err)
      })
    })
    .catch(err => {
      console.log('error findOne', err)
    })
  })
  .catch(errors => {
    console.log('bad input: ', errors)
    res.boom.badRequest('Invalid input', { errors })
  })
}

/**
 * @desc Login with a username and password
 * @function POST /login
 * @example
 *  TOKEN=$(curl \
    -H "Accept: application/json" \
    -H "Content-type: application/json" \
    -XPOST \
    -d $DATA $URL/login | jq -r ".token")
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ where: { email } })
  .then(user => {
    if(!user) {
      return res.boom.notFound('User not found')
    }

    bcrypt.compare(password, user.password)
      .then(result => {
      if (!result) {
        return res.boom.unauthorized('Incorrect password');
      }
      const payload = {uuid: user.uuid};
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ message: "ok", token: token });
    })
    .catch(err => {
      console.log('bcrypt compare error')
    })
  })
  .catch(err => res.boom.unauthorized(err))
}

/**
 * @desc Get the user profile for the currently logged in user
 * @function GET /me
 */
const getProfile = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { email, zipcode, createdAt, updatedAt } = req.user;

    res.json({
      email, zipcode, createdAt, updatedAt
    })
  }
]

/**
 * @desc Update the currently logged in user's profile
 * @function PUT /me
 */
const updateProfile = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log('aksdjfkadkfjdjf', req.body)
    const { id } = req.user;
    User.findOne({ where: { id }})
    .then(user => {
      if (!user) { return res.boom.notFound('User not found') }

      const { email, zipcode } = req.body;
      user.update({
        email, zipcode
      })
      .then(() => res.json({ message: 'success' }))
      .catch(errors => res.boom.badImplementation('Something bad happened', { errors }))
    })
  }
]

class MovieApi {
  constructor() {
    const db = MovieDB(MOVIE_API_KEY)
    this.db = db;
    this.cache = {}

    const opts = {
      promise: true,
      length: false,
      maxAge: 1000 * 60,
      normalizer: (opts) => JSON.stringify(opts),
    };
    const memoizer = (fn) => memoize(this._call(fn), opts)

    this.getInfo = memoizer((opts={}, cb) => db.movieInfo(opts, cb))
    this.getTrailers = memoizer((opts={}, cb) => db.movieTrailers(opts, cb))
    this.discoverPopular = memoizer((opts={}, cb) => db.discoverMovie(opts, cb))
    this.getConfig = memoizer((opts={}, cb) => db.configuration(opts, cb))
    this.getGenres = memoizer((opts={}, cb) => db.genreMovieList(cb))
    this.getMoviesForGenre = memoizer((opts={}, cb) => db.genreMovies(opts, cb))
    this.searchMovie = memoizer((opts={}, cb) => db.searchMovie(opts, cb))
    this.getMovieImages = memoizer((opts={}, cb) => db.movieImages(opts, cb))
  }

  _call(fn) {
    return (...args) => {
      return new Promise((resolve, reject) => {
        const cb = (err, res) => err ? reject(err) : resolve(res);
        args = [].concat(args || [], cb)
        console.log('calling...', args);
        fn.call(this, ...args)
      })
    }
  }
}

/**
 * @desc Get the movie configuration object
 * @function GET /config
 */
const getMovieConfig = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    movieApi.getConfig()
      .then(cfg => res.json(cfg))
      .catch(errors => res.boom.badRequest('Error', { errors }))
  }
]

/**
 * @desc Get a list of the popular movies
 * @function GET /movies
 */
const getMovies = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const page = req.query.page || 1;
    movieApi.discoverPopular({
      page
    })
    .then((movies) => {
      const { page, results } = movies;
      res.json({
        page,
        movies: results
      });
    })
    .catch(errors => res.boom.badRequest('Error', { errors }))
  }
]

const searchMovies = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log('searching...', req.query, req.params)
    const query = req.query.q;
    if (!query) {
      return res.boom.badRequest('No query string provided')
    }
    const page = req.query.page || 1;
    movieApi.searchMovie({
      query,
      page,
    }).then(movies => {
      const { page, results } = movies;
      res.json({
        page,
        movies: results
      });
    })
    .catch(errors => res.boom.badRequest('Error', { errors }))
  }
]

const getGenres = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    movieApi.getGenres({})
    .then(genres => res.json(genres))
    .catch(errors => res.boom.badRequest('Error', { errors }))
  }
]

const getGenre = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id } = req.params;
    const page = req.query.page || 1;

    movieApi.getMoviesForGenre({ id, page })
    .then(movies => res.json(movies))
    .catch(errors => res.boom.badRequest('Error', { errors }))
  }
]

const getMovie = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id } = req.params;
    console.log('movies', req.params)
    movieApi.getInfo({ id })
    .then(movie => res.json(movie))
    .catch(errors => res.boom.badRequest('Error', { errors }))
  }
]

const getMovieTrailers = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id } = req.params;
    movieApi.getTrailers({ id })
    .then(movie => res.json(movie))
    .catch(errors => res.boom.badRequest('Error', { errors }))
  }
]

/**
 * @desc Get known movie images for movie
 * @function GET /movies/:id/images
 */
const getMovieImages = [
   passport.authenticate('jwt', { session: false }),
   (req, res) => {
     const { id } = req.params;
     movieApi.getMovieImages({ id })
     .then(movie => res.json(movie))
     .catch(errors => res.boom.badRequest('Error', { errors }))
   }
 ]

const getMyMovies = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { user } = req;
    user.getMovies()
    .then(movies => new Promise(resolve => {
      resolve(
        movies.map(movie => movie.details ?
          Object.assign({}, JSON.parse(movie.details), { uuid: movie.uuid }) :
          null)
      )
    }))
    .then(movies => res.json(movies))
    .catch(errors => res.boom.badRequest('Error', { errors }))
  }
]

const getMyMovie = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { user } = req;
    const { uuid } = req.params;
    user.getMovies({ where: { uuid } })
    .then(movies => new Promise(resolve => {
      resolve(
        movies.map(movie => movie.details ?
          Object.assign({}, JSON.parse(movie.details), { uuid: movie.uuid }) :
          null)
      )
    }))
    .then(movies => res.json(movies))
    .catch(errors => res.boom.badRequest('Error', { errors }))
  }
]

const getMyFavorites = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { user } = req;
    const { movie_id } = req.body;
    Movie.findOrCreate({
      where: { api_id: movie_id }
    }).spread((movie, created) => {
      const promise = created || true ?
                      movieApi.getInfo({id: movie_id}) : Promise.resolve(movie.details)

      promise
      .then(details => {
        movie.details = JSON.stringify(details)
        movie.save().then((movie) => {
          user.addMovie(movie)
            .then(() => res.json({ status: 'success' }))
            .catch(errors => {
              console.log('error ->', errors)
              res.boom.badRequest('Error', { errors });
            })
        })
      })
      .catch(errors => res.boom.badRequest('Error', { errors }))
    })
  }
]

const removeMyFavorite = [
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { user } = req;
    const { uuid } = req.params;

    console.log('uuid ->', uuid)
    user.removeMovie({
      where: { uuid }
    })
    .then(() => res.json({ status: 'success' }))
    .catch(errors => res.boom.badRequest('Error', { errors }))
  }
]

const movieApi = new MovieApi();
app.get('/time', getCurrentTime);
app.get('/time/subscribe', subscribeCurrentTime);
app.get('/routes', listRoutesRoute);
app.delete('/_reset', resetDB)
app.post('/signup', signup);
app.post("/login", login);
app.get('/me', ...getProfile)
app.put('/me', ...updateProfile)
app.get('/config', ...getMovieConfig)
app.get('/movies', ...getMovies)
app.get('/movies/search', ...searchMovies)
app.get('/genres', ...getGenres)
app.get('/genres/:id', ...getGenre)
app.get('/movies/:id', ...getMovie)
app.get('/movies/:id/trailers', ...getMovieTrailers)
app.get('/movies/:id/images', ...getMovieImages)
app.get('/me/movies', ...getMyMovies)
app.get('/me/movies/:uuid', ...getMyMovie)
app.post('/me/movies', ...getMyFavorites)
app.delete('/me/movies/:uuid', ...removeMyFavorite)

module.exports = app
module.exports.app = app
