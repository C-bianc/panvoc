// Importing required modules
const express = require('express')
const router = express.Router()
const { getClient } = require('../app')
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')

// Initialize DOMPurify to sanitize HTML input
const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

// Setting up MongoDB client and database collections
const client = getClient()
const db = client.db()
const users = db.collection('users')
const feedbacks = db.collection('feedbacks')
const definitions = db.collection('definitions')

// Route to handle GET requests to the suggestion page
router.get('/', function (req, res) {
  res.render('suggestion', {
    title: 'Suggestions | Panvoc',
    thankMessage: null,
    errorMessage:null,
  })
})

// Route to handle POST requests for submitting feedback
router.post('/submitFeedback', async function (req, res) {
  // Sanitize the feedback input
  const formInput = req.body.suggestion
  const sanitizedInput = DOMPurify.sanitize(formInput, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).replace(/[\r\n]+/g, ' ')

  // Prepare the feedback data
  const username = req.session.username
  const date = new Date().toLocaleString('fr-FR')
  const feedback = {
    userId: username, 
    feedbackMessage: sanitizedInput,
    sentAt: date
  }

  // Store the feedback in the database
  await feedbacks.insertOne(feedback)
  console.log(`Feedback from ${req.session.username} stored successfully`)

  // Render the suggestion page with a thank you message
  return res.status(200).render('suggestion', {
    title: 'Suggestions | Panvoc',
    thankMessage: 'We will review your suggestion. Thank you!',
    errorMessage:null,
  })
})

// Route to handle POST requests for submitting word suggestions
router.post('/submitWord', async function (req, res) {
  const wordFormInput = req.body.suggest_word;
  const username = req.session.username;

  // Check if the word suggestion already exists in the definitions collection
  const existingWord = await definitions.findOne({ word: wordFormInput });

  // If the word already exists, render the suggestion page with an error message
  if (existingWord) {
    console.log(`Word suggestion ${wordFormInput} from ${req.session.username} already exists in the word list`);
    return res.status(200).render('suggestion', {
      title: 'Suggestions | Panvoc',
      thankMessage: null,
      errorMessage: 'Sorry! The word you suggested is already in our word list'
    });
  }

  // If the word does not exist, store the word suggestion in the user's document
  await users.updateOne({ username: username }, { $push: { wordSuggestions: wordFormInput } });

  console.log(`Word suggestion ${wordFormInput} from ${req.session.username} stored successfully`);

  // Render the suggestion page with a thank you message
  return res.status(200).render('suggestion', {
    title: 'Suggestions | Panvoc',
    thankMessage: 'We will review your suggested word. Thank you!',
    errorMessage:null,
  });
})

// Export the router
module.exports = router