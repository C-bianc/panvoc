// Importing required modules
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { getClient } = require('../app')

// Importing utility functions
const { checkValidEmail } = require('../utils/emailPattern.js')
const { calculateTimeSinceCreation } = require('../utils/timeCreation')
const { parseCSVFile } = require('../utils/parseVocList')

// Importing multer for file upload handling
const multer = require('multer')
const upload = multer()

// Setting up MongoDB client and database collection
const client = getClient()
const db = client.db()
const users = db.collection('users')

// Middleware to initialize userStats variable in response object
const statsVar = (req, res, next) => {
  res.locals.userStats = []
  next()
}
router.use(statsVar)

// Route to handle GET requests to the profile page
router.get('/', async (req, res, next) => {
  // If the user is not logged in, redirect to login page
  if (!req.session.username) {
    req.previousPage = '/profile'
    const previousPage = req.previousPage
    delete req.previousPage
    res.redirect('/login')
  }
  try {
    // Fetching user data from the database
    const user = await users.findOne({ username: res.locals.username })

    // If user not found, return 404 error
    if (!user) {
      console.log('User not found.')
      return res.status(404).render('error', {
        message: 'User not found.',
        error: {},
      })
    }

    // Calculate time since user account creation
    const creationDate = user.createdAt
    const timeSinceCreation = calculateTimeSinceCreation(creationDate)

    // Render the profile page with user data
    res.render('profile', {
      title: 'Profile | Panvoc',
      username: res.locals.username,
      user: user,
      timeSinceCreation: timeSinceCreation,
      showEditForm: null,
      errorMessage: null,
      userStats: user.scores,
      successUserEdit: req.query.uploadSuccess === 'true' ? 'List of personal words created/updated successfully!' : null,
    })

  } catch (err) {
    // Handle any errors
    console.error('Error:', err.message)
    res.status(500).render('error', {
      message: 'Internal Server Error',
      error: err,
    })
  }
})

// Route to handle POST requests to the profile page
router.post('/', (req, res) => {
  const isEdit = req.query['edit-acc']

  // If the request is for editing the profile, render the edit form
  if (isEdit) {
    res.render('profile', {
      title: 'Edit Profile| Panvoc',
      user: users.findOne({ username: res.locals.username }),
      username: res.locals.username,
      successUserEdit: null,
      showEditForm: isEdit,
      errorMessage: null,
    })
  }
})

// Middleware to validate form data
const validateForm = async (req, res, next) => {
  const { new_email, new_password } = req.body
  const errorMessages = []

  // Check if email is valid
  const isValidEmail = checkValidEmail(new_email)
  if (!isValidEmail) {
    errorMessages.push('Email is not valid.')
  }

  // Check if email is already taken
  try {
    const existingUser = res.locals.username
    if (existingUser) {
      if (existingUser.email === new_email) {
        errorMessages.push('This email is already taken.')
      }
    }

    // If there are any errors, render the profile page with error messages
    if (errorMessages.length > 0) {
      return res.status(409).render('profile', {
        title: 'Sign in | Panvoc',
        showEditForm: true,
        errorMessage: errorMessages, 
      })
    }

    // If no errors, proceed to the next middleware
    next() 
  } catch (err) {
    console.error(err.message)
    next(err)
  }
}

// Middleware to hash the new password
const hashPassword = async (req, res, next) => {
  const { new_password } = req.body
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(new_password, saltRounds)
    req.body.new_password = hashedPassword
    next()
  } catch (err) {
    console.error('Error hashing password:', err)
    next(err)
  }
}

// Middleware to edit user data in the database
const editUser = async (req, res, next) => {
  const { new_email, new_password } = req.body

  try {
    // Update user data in the database
    const newUser = await users.updateOne(
      { username: res.locals.username },
      {
        $set: { email: new_email, password: new_password },
        $currentDate: { lastModified: true },
      }
    )

    // Fetch the updated user data
    const user = await users.findOne({ username: res.locals.username })
    const creationDate = user.createdAt
    const timeSinceCreation = calculateTimeSinceCreation(creationDate)

    // Render the profile page with success message
    return res.status(201).render('profile', {
      title: 'Profile | Panvoc',
      username: res.locals.username,
      user: user,
      timeSinceCreation: timeSinceCreation,
      showEditForm: false,
      errorMessage: null,
      successUserEdit: 'Account edited successfully!',
    })
  } catch (err) {
    console.error(err.message)
    next(err)
  }
}

// Route to handle POST requests for editing user account
router.post('/edit-account', validateForm, hashPassword, editUser)

// Route to handle file upload
router.post('/upload', upload.single('csvFile'), async (req, res) => {
  try {
    const username = res.locals.username

    // Parse the uploaded CSV file
    const fileContent = req.file.buffer.toString()
    const definitions = parseCSVFile(fileContent)

    // Update user data with the parsed CSV data
    const userDocument = {
      username: username,
      data: definitions,
    }

    const result = await users.updateOne(
      { username: username },
      { $set: userDocument },
      { upsert: true }
    )

    // Redirect to profile page with success message
    if (result.upsertedCount > 0) {
      res.redirect('/profile?uploadSuccess=true')
    } else {
      res.redirect('/profile?uploadSuccess=true')
    }
  } catch (error) {
    console.error('Error uploading file:', error.message)
    res.status(500).send('Internal Server Error')
  }
})

// Export the router
module.exports = router