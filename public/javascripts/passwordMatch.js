// Add an 'input' event listener to the password confirmation field
document.getElementById('floatingPasswordConfirm').addEventListener('input', function () {
  // Get the value of the password field
  const password = document.getElementById('floatingPassword').value
  // Get the value of the password confirmation field
  const confirmPassword = this.value

  // Select the invalid feedback element related to the password confirmation field
  const invalidFeedbackMatch = document.querySelector('#floatingPasswordConfirm ~ .invalid-feedback') 
  // Select the valid feedback element related to the password confirmation field
  const validFeedbackMatch = document.querySelector('#floatingPasswordConfirm ~ .valid-feedback')

  // Select the submit button
  const submitButton = document.getElementById('submit-btn')

  // If the password and confirmation password do not match
  if (password !== confirmPassword) {
    // Show the invalid feedback message
    invalidFeedbackMatch.style.display = 'block'
    // Hide the valid feedback message
    validFeedbackMatch.style.display = 'none'

    // Disable the submit button
    submitButton.disabled = true

  } else {
    // If the password and confirmation password match
    // Hide the invalid feedback message
    invalidFeedbackMatch.style.display = 'none'
    // Show the valid feedback message
    validFeedbackMatch.style.display = 'block'

    // Enable the submit button
    submitButton.disabled = false
  }
})