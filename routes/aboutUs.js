// Import the express module
const express = require('express')

// Create a new router object
const router = express.Router()

// Define a GET route for the root ('/') of this router
// When a GET request is made to this route, the function will be executed
router.get('/', function (req, res) {
  // Render the 'aboutUs' view and pass in an object with a title property
  res.render('aboutUs', { title: 'About Us | Panvoc' })
})

// Export the router so it can be used in other parts of the application
module.exports = router