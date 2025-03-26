// This function generates a random number between 0 and the given length
export function generateRandomNumber (length) {
  // Math.random generates a random decimal between 0 and 1
  // Multiplying by length gives a number between 0 and length
  // Math.floor rounds down to the nearest whole number
  return Math.floor(Math.random() * length)
}

// This function generates an array of unique random numbers within a given range
export function generateRandomNumbersInRange (min, max) {
  // Create an array from min to max
  const numbers = Array.from({ length: max - 1 - min + 1 }, (_, index) => index + min)
  
  // Shuffle the array using the Fisher-Yates algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    // Generate a random index
    const j = Math.floor(Math.random() * (i));
    // Swap the current element with the element at the random index
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]] 
  }
  // Return the shuffled array
  return numbers
}