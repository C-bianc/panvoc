// initialize modules
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const session = require('express-session')
const logger = require('morgan') // for logs
const fs = require('fs') // for reading files in system

// email domain list (TLD for top-level domain, source https://www.iana.org/)

require('./utils/updateDomainList.js')

// initialize mongodb
const { MongoClient } = require('mongodb')

// maybe change db name
const dbUri = 'mongodb://127.0.0.1:27017/panvoc_db'
const client = new MongoClient(dbUri)

function connectToDatabase () {
  try {
    client.connect()
    console.error('Error connecting to the database:', err)

  } catch {
    console.log(`Connected to panvoc_db`)
  }
}

function getClient () {
  if (!client) {
    throw new Error('MongoDB client is not initialized')
  }
  return client
}

connectToDatabase()
module.exports = { connectToDatabase, getClient }

// initialize app
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/js/dist')))
app.use(express.urlencoded({ extended: true })) // urlencoded is now built-in so no need bodyparser
app.use(express.json())
const hostname = '127.0.0.1'
const port = 8080

// router modules
const indexRoute = require('./routes/index')           // main page
const loginRoute = require('./routes/login')           // login page
const gameRoute = require('./routes/game')             // game page
const profileRoute = require('./routes/profile')       // profile page
const suggestionRoute = require('./routes/suggestion') // suggestion page
const aboutUsRoute = require('./routes/aboutUs')       // about us page

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// logger format
app.use(logger('dev')) // mise en forme 'dev' du logger

// user session secret key
const configPath = './config.json'
// reading secret key stored in config.json
const configSessionKey = fs.readFileSync(configPath, 'utf8') // key generated with openssl base64
const configFile = JSON.parse(configSessionKey)
const secretKeySession = configFile.secretKey

app.use(session({
  secret: secretKeySession,
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 3600000
  },
  rolling: true
})) // must do a cookie banner maybe ?

// middleware which allows to store the username and pass across the entire app
app.use((req, res, next) => {
  res.locals.username = req.session.username || null
  next()
})

// middleware which stores previous page in order to redirect after login
app.use((req, res, next) => {
  const protectedRoutes = ['/play', '/suggest', '/profile']
  const requestedRoute = req.originalUrl

  if (protectedRoutes.includes(requestedRoute) && !req.session.previousPage && !req.session.username) {
    console.log('registered route', requestedRoute)
    req.session.previousPage = requestedRoute
  }

  next()
})

// set routes
app.use('/play', gameRoute)
app.use('/profile', profileRoute)
app.use('/about', aboutUsRoute)
app.use('/suggest', suggestionRoute)
app.use('/', indexRoute)
app.use('/login', loginRoute)

// GET user logout
app.get('/logout', async (req, res, next) => {
  const logoutTime = new Date().toLocaleString('fr-FR')

  // add logout time in db
  try {
    const users = client.db().collection('users')

    const updateLogoutTime = { $set: { lastLogin: logoutTime } } // update query
    const result = await users.findOneAndUpdate({ username: req.session.username }, updateLogoutTime)

    if (result.modifiedCount === 1) {
      console.log(`${req.session.username} logged out at ${logoutTime}`)
    }
  } catch (err) {
    console.error('Error updating logout time', err)
  }

  // destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err)
      console.error(err.stack)
      next(err)
    } else {
      res.redirect('/')
    }
  })
})

// post USER delete
app.post('/delete', async (req, res, next) => {
  const username = req.session.username

  try {
    const users = client.db().collection('users')
    await users.findOneAndDelete({ username })

    req.session.destroy(err => {
      if (err) {
        res.status(500)
        console.log('Error logging out', err)
      } else {
        return res.status(200).redirect('/')
      }
    })
  } catch (err) {
    res.status(500)
    next(err)
  }
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({
    error: {
      message: err.message,
      stack: req.app.get('env') === 'development' ? err.stack : 'Internal Server Error'
    }
  })

  // Optionally, you can log the error for further debugging
  console.error(err.stack)
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

module.exports = app
