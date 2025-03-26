// Define a function called countdown
function countdown () {
  // Get the HTML element with the id 'countdown'
  const countdownElement = document.getElementById('countdown')
  // Get the HTML element with the id 'afterCountdown'
  const afterCountdown = document.getElementById('afterCountdown')
  // Get the HTML element with the id 'go-text'
  const goText = document.getElementById('go-text')
  // Get the HTML element with the id 'game-column'
  const gameColumn = document.getElementById('game-column')
  // Initialize a variable count with the value 3
  var count = 3

  // Set an interval to execute a function every 1000 milliseconds (1 second)
  const interval = setInterval(function () {
    // If count is greater than 0
    if (count > 0) {
      // Set the inner text of the countdownElement to the current count
      countdownElement.innerText = count
      // Decrement the count by 1
      count--
    } else {
      // If count is not greater than 0, clear the interval
      clearInterval(interval)
      // Hide the countdownElement
      countdownElement.style.display = 'none'
      // Display the goText element
      goText.style.display = 'inline' 
      // Set a timeout to execute a function after 1000 milliseconds (1 second)
      setTimeout(function () {
        // Hide the goText element
        goText.style.display = 'none'
        // Display the afterCountdown element
        afterCountdown.style.display = 'block' 
        // Remove the 'align-self-center' class from the gameColumn element
        gameColumn.classList.remove('align-self-center')
        // Add the 'self-align-start' class to the gameColumn element
        gameColumn.classList.add('self-align-start')
      }, 1000) 
    }
  }, 1000) // 1000 milliseconds = 1 second
}

// When the window loads, execute the countdown function
window.onload = function () {
  countdown()
}