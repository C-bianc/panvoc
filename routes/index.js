// Importing the express module
const express = require('express')

// Creating a new router object from express
const router = express.Router()

// Importing the getClient function from the app module
const { getClient } = require('../app')

// Getting a client instance
const client = getClient()

// Getting a database instance from the client
const db = client.db()

// Getting the users collection from the database
const users = db.collection('users')

// Function to calculate total scores for each user
async function calculateTotalScores (usersData) {
  // Object to store total scores for each user
  const totalScores = {}

  // Loop over each user
  usersData.forEach(user => {
    // Initialize total score for current user
    let total = 0

    // Loop over each score of the current user
    Object.values(user.scores).forEach(score => {
      // If the score is a number, add it to the total score
      if (typeof score === 'number') {
        total += score
      }
    })

    // Store the total score for the current user
    totalScores[user.username] = total

    // Sort the users by total score in descending order
    const sortedUsers = Object.keys(totalScores).sort((a, b) => totalScores[b] - totalScores[a])

    // Return the top 10 users with their total scores
    return sortedUsers.slice(0, 10).map(username => ({ username, totalScore: totalScores[username] }))
  })
}

// Define a GET route for the root path
router.get('/', async function (req, res) {
  try {
    // Aggregate the users collection to calculate total score for each user and get the top 10 users
    const topPlayers = await users.aggregate([
      {
        // Unwind the scores array
        $unwind: '$scores' 
      },
      {
        // Group by username and calculate total score
        $group: {
          _id: '$username',
          totalScore: { $sum: '$scores.score' }
        }
      },
      {
        // Sort by total score in descending order
        $sort: { totalScore: -1 } 
      },
      {
        // Limit to top 10 users
        $limit: 10 
      }
    ]).toArray()

    // Log the top players
    console.log(topPlayers)

    // Render the index view with the top players
    res.render('index', {
      title: 'Welcome | Panvoc',
      topPlayers: topPlayers,
    })
  } catch (error) {
    // Log the error and send a 500 response
    console.error('Error fetching top players:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Export the router
module.exports = router