const express = require('express')
const router = express.Router()
const { getClient } = require('../app')

const client = getClient()
const db = client.db()
const users = db.collection('users')
const definitions = db.collection('definitions')

// use the list for all paths
const gameButtons = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const setGamePage = (req, res, next) => {
  res.locals.gameButtons = gameButtons
  res.locals.startGame = false
  res.locals.wordsToGuess = []
  res.locals.definitions = null
  res.locals.gameIsOver = null
  next()
}
router.use(setGamePage)


router.get('/', function (req, res) {
  res.render('game', {
    title: 'Play | Panvoc',
    chosenLevel: null,
  })
})

router.get('/launch-game', async (req, res) => {
  // access lvl in url
  const chosenLevel = req.query.level
  let wordsForDisplay = {}

  // if user choses to play on own list
  if (chosenLevel === 'ownList') {
    const user = await users.findOne({ username: req.session.username })
    if (user.data) { wordsForDisplay = user.data } else { wordsForDisplay = []}

  } else {
    // extract definitions according to level
    try {
      const chosenLevel = req.query.level

      // find documents where words have the chosen level
      const query = { [`levels.${chosenLevel}`]: { $exists: true } }
      const result = await definitions.find(query).toArray()

      // console.log(chosenLevel, result.length)

      // prepare the definitions data for html
      wordsForDisplay = result.map(word => {
        return {
          word: word.word,
          definitions: word.levels[chosenLevel].definitions.map(definition => {
            return {
              sense: definition.sense,
              definition: definition.definition,
              example: definition.example
            }
          })
        }
      })
      // check result
      // res.json(wordsForDisplay)

    } catch (err) {
      console.error(err)
      res.status(500)
    }
  }
  res.render('game', {
    title: 'Play | Panvoc',
    chosenLevel: chosenLevel,
    startGame: req.query.start,
    wordsToGuess: wordsForDisplay
  })
})

router.get('/quit', function (req, res) {
  res.redirect('/play')
})

router.get('/game-over', (req, res) => {
  const storedGameData = req.session.gameData

  if (storedGameData) {
    // If game data exists in the session, use it as needed (for example, render a page)
    res.render('game', {
      title: 'Play | Panvoc',
      gameIsOver: true,
      score: storedGameData.score,
      chosenLevel: storedGameData.level,
      guessedWords: storedGameData.guessedWords
    })

  } else {
    // If no game data is found in the session, handle it accordingly (e.g., redirect to home)
    res.redirect('/')

  }
})

router.post('/game-over', async (req, res) => {
  const receivedGameData = req.body
  const bonusPoint = req.body.bonus
  req.session.gameData = receivedGameData

  const updatedScore = receivedGameData.score + (bonusPoint ? bonusPoint : 0)

  // update score in db

  const levelScore = {
    level: receivedGameData.level,
    score: updatedScore
  }

  const user = await users.findOne({ username: req.session.username })
  const currentScores = user.scores || []

  const existingIndex = currentScores.findIndex(item => item.level === levelScore.level)

  if (existingIndex !== -1) {
    // If the level exists, update its score with the maximum value
    currentScores[existingIndex].score = Math.max(levelScore.score, currentScores[existingIndex].score)
  } else {
    // If the level doesn't exist, push a new object for the level with its score
    currentScores.push(levelScore)
  }

// Update the 'scores' field in the user document
  const result = await users.updateOne(
    { username: req.session.username },
    { $set: { scores: currentScores } }
  )

  // Redirect to the game-over page or send any necessary response
  res.redirect('/play/game-over')
})

module.exports = router
