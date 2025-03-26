const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')

describe('DOMPurify Sanitization Tests', () => {
  let window
  let DOMPurify

  beforeEach(() => {
    window = new JSDOM('').window
    DOMPurify = createDOMPurify(window)
  })

  it('Sanitizes script tags to prevent XSS', () => {
    const input = '<script>alert("XSS attack")</script>'
    const sanitizedInput = DOMPurify.sanitize(input)
    expect(sanitizedInput).not.toContain('<script>')
  })

  it('Sanitizes attributes to prevent XSS', () => {
    const input = '<img src="x" onerror="alert(\'XSS\')">' // Malicious onerror attribute
    const sanitizedInput = DOMPurify.sanitize(input)
    expect(sanitizedInput).not.toContain('onerror=')
  })
  it('Sanitizes HTML injection attempts', () => {
    const userInputHTML = '<img src="x" onerror="alert(\'XSS\')">' // Malicious onerror attribute
    const sanitizedHTML = DOMPurify.sanitize(userInputHTML)
    expect(sanitizedHTML).not.toContain('onerror=')
    expect(sanitizedHTML).not.toContain('<img>') // Ensure img tag is removed
  })

  it('Sanitizes CSS injection attempts', () => {
    const userInputCSS = '<div style="background-image: url(javascript:alert(\'XSS\'))"></div>' // Malicious CSS
    const sanitizedCSS = DOMPurify.sanitize(userInputCSS, { ALLOWED_ATTR: [] })
    expect(sanitizedCSS).not.toContain('javascript:') // Ensure 'javascript:' is removed from CSS
  })
})
