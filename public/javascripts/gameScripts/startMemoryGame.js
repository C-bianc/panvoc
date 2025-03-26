import { generateRandomNumber } from './randomizeDefinition.js'

let feedbacks = ['Big brain', 'Gigachad', 'Stonks', 'Good', 'Great!', 'Keep going!', 'Mastermind', 'Harvard is calling...', 'Perfect']
let timer
let bonusPoints = 0
let currentIdx = 0
let learnedWords = []

function startTimer () {
  console.log('Timer started')
  const timerDuration = 30000
  timer = setTimeout(timerDuration)

  // 30s timer
  setTimeout(() => {
    stopTimer()
  }, timerDuration)
}

function changeDisplays () {
  const memoryGameBody = document.getElementById('memory-game')
  const finalClap = document.getElementById('final-game')
  const guessedWordsElem = document.getElementById('guessed-words')
  const bonusPointsElem = document.getElementById('bonus-points')
  const totalScoreElem = document.getElementById('total-score')

  // remove memory game
  memoryGameBody.style.display = 'none'
  finalClap.style.display = 'block'

  // add info (points, guessed words)
  guessedWordsElem.textContent = `${learnedWords}`
  bonusPointsElem.textContent = `Earned ${bonusPoints} bonus points!`
  const totalScore = currentScore + bonusPoints
  totalScoreElem.textContent = `Total points: ${totalScore}`

}

function sendData () {
  // send data to server
  const currentURL = new URL(window.location.href)
  currentURL.searchParams.set('bonus', 'true')

  const gameData = {
    score: bonusPoints,
    level: currentLevel
  }
  fetch('/play/game-over?bonus=true', {
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

function stopTimer () {
  clearTimeout(timer)
  changeDisplays()
  sendData()
}

function updateScore (newScore) {
  let scoreToUpdate = document.getElementById('score-memory')
  // Update the content of the element
  scoreToUpdate.textContent = `Score ${newScore}`
}

function checkAndStopTimer () {
  if (currentIdx + 1 === bonusWords.length) {
    stopTimer()
    console.log('Guessed all words')
    sendData()
  }
}

function checkAnswer (input, currentWord) {
  const userGuessValue = input.value.trim().toLowerCase()
  const feedbackElem = document.getElementById('green-message')

  // if word guessed
  if (userGuessValue === currentWord) {
    bonusPoints += 1
    updateScore(bonusPoints)

    // push guessed word
    learnedWords.push(currentWord)

    // display cheering
    feedbackElem.style.display = 'block'
    feedbackElem.textContent = feedbacks[generateRandomNumber(feedbacks.length)]
    setTimeout(() => {
      feedbackElem.style.display = 'none'
    }, 1500)

    checkAndStopTimer()

    // change definition
    currentIdx += 1

    console.log(userGuessValue, currentWord)

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
  const startMemoryBtn = document.getElementById('memory-game-btn')
  const gameOverBody = document.getElementById('game-over-body')
  const memoryGame = document.getElementById('memory-game')
  const userInput = document.getElementById('userRecall')

  startTimer()

  startMemoryBtn.addEventListener('click', function () {
    gameOverBody.style.display = 'none'
    memoryGame.style.display = 'block'

    userInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        checkAnswer(userInput, bonusWords[currentIdx])
        userInput.value = ''
      }
    })
  })
})