const { validatePassword } = require('../../utils/passwordtest.js') // import js file

// test generated with chat-GPT
describe('validatePassword function', () => {
  it('should return true for a valid password', () => {
    const validPassword = 'Test123!@'
    expect(validatePassword(validPassword)).toBe(true)
  })

  it('should return false for a password less than 8 characters', () => {
    const shortPassword = 'Abc1!'
    expect(validatePassword(shortPassword)).toBe(false)
  })

  it('should return false for a password without an uppercase letter', () => {
    const noUppercase = 'test123!@'
    expect(validatePassword(noUppercase)).toBe(false)
  })

  it('should return false for a password without a number', () => {
    const noNumber = 'TestPass!'
    expect(validatePassword(noNumber)).toBe(false)
  })

  it('should return false for a password without a special character', () => {
    const noSpecialChar = 'Test1234'
    expect(validatePassword(noSpecialChar)).toBe(false)
  })

  it('should return true for a valid password that respects requirements', () => {
    const validPw = 'Val1d_password.%'
    expect(validatePassword(validPw)).toBe(true)
  })
})

