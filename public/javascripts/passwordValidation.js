// Import the validatePassword function from the passwordRequirements.js file
import { validatePassword } from './passwordRequirements.js'

// Add an 'input' event listener to the password field
document.getElementById('floatingPassword').addEventListener('input', function () {
  // Get the value of the password field
  const password = this.value

  // Select the invalid feedback element related to the password field
  const invalidFeedbackPw = document.querySelector('#floatingPassword ~ .invalid-feedback') 
  // Select the valid feedback element related to the password field
  const validFeedbackPw = document.querySelector('#floatingPassword ~ .valid-feedback') 

  // Select the submit button
  const submitButton = document.getElementById('submit-btn')

  // Validate the password using the imported validatePassword function
  let isValid = validatePassword(password) 

  // If the password is not valid
  if (!isValid) {
    // Show the invalid feedback message
    invalidFeedbackPw.style.display = 'inline'
    // Hide the valid feedback message
    validFeedbackPw.style.display = 'none'

    // Disable the submit button
    submitButton.disabled = true
  } else {
    // If the password is valid
    // Hide the invalid feedback message
    invalidFeedbackPw.style.display = 'none'
    // Show the valid feedback message
    validFeedbackPw.style.display = 'block'

    // Enable the submit button
    submitButton.disabled = false
  }
})