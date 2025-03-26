// Add an event listener for the DOMContentLoaded event. This event fires when the initial HTML document has been completely loaded and parsed.
document.addEventListener('DOMContentLoaded', function () {
  
  // Select the close button for the success message using its class
  const successCloseButton = document.querySelector('.close-button-success')
  // Select the close button for the alert message using its class
  const alertCloseButton = document.querySelector('.close-button-alert')

  // Define the ID of the success message div
  const successDiv = 'successMessage'
  // Define the ID of the alert message div
  const alertDiv = 'alertMessage'

  // Define a function to close a message
  function closeMessage (button, parentDiv) {
    // Add a click event listener to the button
    button.addEventListener('click', function () {
      // Select the div to close using its ID
      const divToClose = document.getElementById(parentDiv)

      // Set the display style of the div to 'none', effectively hiding it
      divToClose.style.display = 'none'
    })
  }

  // If the success close button exists, add a click event listener to it to close the success message
  if (successCloseButton) {
    closeMessage(successCloseButton, successDiv)
  }

  // If the alert close button exists, add a click event listener to it to close the alert message
  if (alertCloseButton) {
    closeMessage(alertCloseButton, alertDiv)
  }
})
