// Importing required modules
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { getClient } = require('../app')
const { checkValidEmail } = require('../utils/emailPattern.js')

// Getting a client instance
const client = getClient()

// Getting a database instance from the client
const db = client.db()

// Getting the users collection from the database
const users = db.collection('users')

// Define a GET route for the login page
router.get('/', function (req, res) {
  res.render('login', {
    title: 'Sign in | Panvoc',
    errorMessage: null,
    showRegistrationForm: false,
    successUserCreation: null,
  })
})

// Define a POST route for the login page
router.post('/', (req, res) => {
  const isNewUser = req.query['new-acc']

  if (isNewUser) {
    res.render('login', {
      title: 'Sign in | Panvoc',
      showRegistrationForm: isNewUser,
      errorMessage: null,
      successUserCreation: null,
    })
  }
})

// Define a POST route for connecting (logging in) a user
router.post('/connect', async function (req, res) {
  // Get current date and time
  const currentDate = new Date()
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  const formattedDateTime = currentDate.toLocaleString('fr-FR', options)
  const { username, password } = req.body

  // Check if user exists and password is correct
  const user = await users.findOne({ username: username })

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (passwordMatch) {
      // Update lastLogin field
      await users.updateOne({ username: username }, { $set: { lastLogin: formattedDateTime } })

      req.session.username = username // store user session
      const previousPage = req.session.previousPage || '/'
      delete req.session.previousPage
      res.redirect(previousPage)

      req.session.username = username // store user session
    } else {
      // invalid login credentials
      return res.status(401).render('login', {
        title: 'Sign in | Panvoc',
        showRegistrationForm: false,
        errorMessage: 'Wrong password.',
        successUserCreation: null,
      })
    }
  } else {
    // user not found
    return res.status(401).render('login', {
      title: 'Sign in | Panvoc',
      showRegistrationForm: false,
      errorMessage: 'Username not found.',
      successUserCreation: null,
    })
  }
})

// Middleware to validate form data
const validateForm = async (req, res, next) => {
  const { username, email } = req.body
  const errorMessages = []

  const isValidEmail = checkValidEmail(email)
  if (!isValidEmail) {
    errorMessages.push('Email is not valid.')
  }

  try {
    const existingUser = await users.findOne({ $or: [{ username }, { email }] })

    if (existingUser) {
      if (existingUser.username === username) {
        errorMessages.push('This username is already taken.')
      }
      if (existingUser.email === email) {
        errorMessages.push('This email is already taken.')
      }
    }

    if (errorMessages.length > 0) {
      return res.status(409).render('login', {
        title: 'Sign in | Panvoc',
        showRegistrationForm: true,
        errorMessage: errorMessages, // Join error messages
        successUserCreation: null,
      })
    }

    next() // Move to next if no duplicates
  } catch (err) {
    console.error(err.message)
    next(err)
  }
}

// Middleware for hashing password
const hashPassword = async (req, res, next) => {
  const { password } = req.body

  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    req.body.password = hashedPassword
    next()
  } catch (err) {
    console.error('Error hashing password:', err)
    next(err)
  }
}

// Middleware for creating a new user
const createUser = async (req, res) => {
  const { username, email, password } = req.body

  // get current date time
  const currentDate = new Date()

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }

  const formattedDateTime = currentDate.toLocaleString('fr-FR', options)
  try {
    const newUser = await users.insertOne({
      username: username,
      password: password,
      email: email,
      createdAt: formattedDateTime,
    })

    console.log('Created user ', newUser)

    // success
    return res.status(201).render('login', {
      title: 'Sign in | Panvoc',
      showRegistrationForm: false,
      errorMessage: null,
      successUserCreation: 'Account created successfully! You may now log in.',
    })
  } catch (err) {
    console.error(err.message)
    // internal error
    next(err)
  }
}

// Define a POST route for creating a new account
router.post('/create-account', validateForm, hashPassword, createUser)

// Export the router
module.exports = router