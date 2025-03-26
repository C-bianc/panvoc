const fetch = require('node-fetch')  // used node-fetch v2 which remains compatible with CommonJS
const fs = require('fs').promises

// get top level domains list (source : https://www.iana.org/)
async function fetchAndCacheTLDList () {
  const TLD_FILE_URL = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt'
  const TLD_CACHE_FILE = __dirname + '/domList.txt'

  // read existing file
  const existingData = await fs.readFile(TLD_CACHE_FILE, 'utf-8')
  let existingArray = []
  if (existingData) {
    existingArray = existingData.split('|') // parse current json content
  }

  // try fetching, if failed then return current list from file
  try {
    const response = await fetch(TLD_FILE_URL) // fetch from domain list in txt file
    const tldListText = await response.text() // get the text
    let tldArray = tldListText
      .split('\n')
      .filter(line => !line.startsWith('#') && line.trim() !== '')
      .map(line => line.toLowerCase()) // process data (split, ignore first line and lowercase)

    // filter the existing items to add the new ones
    const newItems = tldArray.filter(item => !existingArray.includes(item))

    let updatedData = [...existingArray, ...newItems] // merge [Array1, Array2]
    // (see https://dmitripavlutin.com/javascript-merge-arrays/)

    const totalItems = updatedData.length

    updatedData = updatedData.join('|') // to use in regex
    // write the updated array
    await fs.writeFile(TLD_CACHE_FILE, updatedData) // value, replacer, spaces
    console.log(`Added ${newItems.length} new items to the TLD list.`)

    return totalItems

  } catch (error) {
    console.error('Error fetching and updating TLD list:', error)
    // return current domain list if fetching failed
    return existingArray
  }
}

module.exports = { fetchAndCacheTLDList }