export function displayDefinitions (word) {
  const urlParams = new URLSearchParams(window.location.search)
  const levelParam = urlParams.get('level') 
  const container = document.querySelector('.card-body') 
  container.innerHTML = ''

  if (levelParam === 'ownList') {
    const definition = word.definition
    const definitionElement = document.createElement('div')
    definitionElement.classList.add('text-start', 'mb-2')

    // Display single definition
    definitionElement.innerHTML = `<div class="row mt-3 m-1"><div class="col-3 fw-bold text-end" id="definition-title">Definition:</div><div class="col-8 mb-1" id="definition-text">${definition}</div></div>`
    container.appendChild(definitionElement)

  } else {
    const definitions = word.definitions 

    definitions.forEach(definition => {
      const definitionElement = document.createElement('div')
      definitionElement.classList.add('text-start', 'mb-2')

      let sense
      if (definition.sense !== word.word) {
        sense = definition.sense.includes('literal') ? definition.sense : `(Sense: ${definition.sense})`
        /* do not display sense if there sense == literal sense*/
      } else {
        
        sense = '<!-- our definition is displayed here with js-->'
      }
      
      const def = definition.definition
      let example = definition.example
      let exampleTitle = 'Example:'
      if (example == null) {
        example = ''
        exampleTitle = ''
      }

      const infoSense = `<div class="row text-info m-1"><div class="col-3" id="sense-no-literal"></div><div class="col-8 mb-3 fw-bold text-info fs-5" id="definition-text">${sense}</div></div>`
      const definitionRow = `<div class="row m-1"><div class="col-3 fw-bold text-end" id="definition-title">Definition:</div><div class="col-8 mb-1" id="definition-text">${def}</div></div>`
      const exampleRow = `<div class="row mb-5"><div class="col-3 ms-1 fw-bold text-end" id="example-title">${exampleTitle}</div><div class="col-8 fst-italic" id="example-text">${example}</div></div>`

      definitionElement.innerHTML = infoSense + definitionRow + exampleRow 
      container.appendChild(definitionElement)
    })
  }
}
