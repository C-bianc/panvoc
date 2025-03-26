// Wait until the HTML document is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Select all elements with the class 'chooseLvlLink'
  const links = document.querySelectorAll('.chooseLvlLink')

  // For each link element
  links.forEach(function (link) {
    // Add a click event listener
    link.addEventListener('click', function (event) {
      // Create a URLSearchParams object from the current URL's query string
      const queryParams = new URLSearchParams(window.location.search)
      
      // Get the value of the 'start' parameter from the query string
      const startParamValue = queryParams.get('start')

      // If the 'start' parameter is present and its value is 'true'
      if (startParamValue !== null && startParamValue === 'true') {
        // Prevent the default action of the click event
        event.preventDefault() 
        // Show an alert to the user
        alert('Please finish or quit the current game')
      }
    })
  })
})

// Add an event listener for the 'beforeunload' event on the window
window.addEventListener('beforeunload', (event) => {
  // Check if the current URL contains 'start=true'
  const urlContainsStart = window.location.href.includes('start=true')
})