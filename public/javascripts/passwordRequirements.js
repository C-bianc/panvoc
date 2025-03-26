export function validatePassword (password) {
  /* check if password
  is at least 8 characters
  contains at least one uppercase letter, one number and one punct sign
  */
  const uppercaseRegex = /[A-Z]/
  const numberRegex = /[0-9]/
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/

  return (
    password.length >= 8 &&
    uppercaseRegex.test(password) &&
    numberRegex.test(password) &&
    specialCharRegex.test(password)
  )
}
