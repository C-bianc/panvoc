const { checkValidEmail } = require('../../utils/emailPattern') // import js file

// test generated with chat-GPT
describe('checkValidEmail function', () => {

  // test cases for an invalid emails
  it('should return false for an invalid email', () => {
    const invalidEmail = 'invalid_email.com'
    expect(checkValidEmail(invalidEmail)).toBe(false)
  })
  it('should return false for an email with spaces', () => {
    const invalidEmail = 'invalid email@test.com'
    expect(checkValidEmail(invalidEmail)).toBe(false)
  })

  it('should return false for an email with a missing domain', () => {
    const invalidEmail = 'invalidemail@'
    expect(checkValidEmail(invalidEmail)).toBe(false)
  })

  it('should return false for an email with consecutive punct signs in local part', () => {
    const invalidEmail = 'invalid..email@test.com'
    expect(checkValidEmail(invalidEmail)).toBe(false)
  })

  it('should return false for an email with consecutive dots in the domain part', () => {
    const invalidEmail = 'example@invalid..com'
    expect(checkValidEmail(invalidEmail)).toBe(false)
  })

  it('should return false for an email with punct sign before @', () => {
    const invalidEmail = 'example.@invalid.be'
    expect(checkValidEmail(invalidEmail)).toBe(false)
  })

  it('should return false for an email with hyphen after @', () => {
    const invalidEmail = 'example@-invalid.be'
    expect(checkValidEmail(invalidEmail)).toBe(false)
  })
  it('should return false for an email with dot after @', () => {
    const invalidEmail = 'example@.invalid.be'
    expect(checkValidEmail(invalidEmail)).toBe(false)
  })

  it('should return false for an email with a single character domain', () => {
    const invalidEmail = 'example@invalid.c'
    expect(checkValidEmail(invalidEmail)).toBe(false)
  })

  it('should return false for local part exceeding 64 characters', () => {
    const invalidEmail = 'waytoolongnamewhichwilldefinitelyexceed64charactersbecauselocalpa@invalid.com'
    expect(checkValidEmail(invalidEmail)).toBe(false)
  })

  // test cases for a valid emails
  it('should return true for a valid email', () => {
    const validEmail = 'example@test.org'
    expect(checkValidEmail(validEmail)).toBe(true)
  })

  it('should return true for an email with punct sign in local part', () => {
    const invalidEmail = 'invalid!email@test.kr'
    expect(checkValidEmail(invalidEmail)).toBe(true)
  })

  it('should return true for a valid email with subdomains', () => {
    const validEmail = 'example@subdomain.test.org'
    expect(checkValidEmail(validEmail)).toBe(true)
  })

  it('should return true for a valid email with a long domain', () => {
    const validEmail = 'example@subdomain.reallylongdomainname.com'
    expect(checkValidEmail(validEmail)).toBe(true)
  })

})
