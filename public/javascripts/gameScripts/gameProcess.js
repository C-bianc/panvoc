import { displayDefinitions } from './displayDefinitions.js'
import { generateRandomNumbersInRange, generateRandomNumber } from './randomizeDefinition.js'

let feedbacks = ['Correct!', 'Good', 'Great!', 'Keep going!', 'Mastermind', 'Harvard is calling...', 'Perfect']
let score = 0
let gameSetSize = gameSet.length
let randIndexes = generateRandomNumbersInRange(0, gameSetSize) // indexes in range of voc size
let timer // Declare a global timer variable
let guessedWords = []
let randIdx = randIndexes.pop()
let wordToGuess = gameSet[randIdx].word.toLowerCase()

function startTimer () {
  console.log('Timer started')
  const timerDuration = 180000 // 3 minutes in milliseconds
  timer = setTimeout(timerDuration)

  displayDefinitions(gameSet[randIdx])

  // Stop the timer after three minutes
  setTimeout(() => {
    stopTimer()
  }, timerDuration)
}

function sendData () {
  // send data to server
  const url = new URL(window.location.href)
  const levelParam = url.searchParams.get('level')
  const gameData = {
    score: score,
    guessedWords: guessedWords,
    level: levelParam
  }
  fetch('/play/game-over', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  })
    .then(response => {
      window.location.href = '/play/game-over'
    })
    .catch(error => {
      console.error('Error sending data to server:', error)
    })
}

function checkAndStopTimer () {
  if (randIndexes.length === 0) {
    stopTimer()
    console.log('Guessed all words')
    sendData()
  }
}

function stopTimer () {
  clearTimeout(timer)
  sendData()
}

function updateScore (newScore) {
  let scoreToUpdate = document.getElementById('score')
  // Update the content of the element
  scoreToUpdate.textContent = `Score ${newScore}`
}

function checkAnswer (input, currentWord) {
  const userGuessValue = input.value.trim().toLowerCase()
  const feedbackElem = document.getElementById('green-message')

  // if word guessed
  if (userGuessValue === currentWord) {
    score += 1
    updateScore(score)

    // display cheering
    feedbackElem.style.display = 'block'
    feedbackElem.textContent = feedbacks[generateRandomNumber(feedbacks.length)]
    setTimeout(() => {
      feedbackElem.style.display = 'none'
    }, 1500)

    // add guessed word to list for later
    guessedWords.push(currentWord)

    checkAndStopTimer()
    // change definition
    randIdx = randIndexes.pop()

    displayDefinitions(gameSet[randIdx]) // nex definition
    wordToGuess = gameSet[randIdx].word.toLowerCase() // update the current word to guess
    input.value = '' // remove answer from user

    // display bad guess message
  } else {
    const errorMessage = document.getElementById('red-message')
    errorMessage.style.display = 'block'
    setTimeout(() => {
      errorMessage.style.display = 'none'
    }, 1500)
  }
}

document.addEventListener('DOMContentLoaded', function () {
  startTimer()

  // check if answer is good

  const submitButton = document.getElementById('submitGuess')
  const userGuessInput = document.getElementById('userGuess')

  // console.log(gameSetSize)

  submitButton.addEventListener('click', function () {
    checkAnswer(userGuessInput, wordToGuess)
    userGuessInput.value = ''
  })

  // allow user to user enter to submit the word
  userGuessInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      checkAnswer(userGuessInput, wordToGuess)
      userGuessInput.value = ''
    }
  })
})
