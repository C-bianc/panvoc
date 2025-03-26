// Function to parse CSV file content, handling different line endings
// the function should take a csv file content as a string and return an array of objects
function parseCSVFile(fileContent) {
  if (!fileContent) return [];

  const lines = fileContent.split(/\r\n|\r|\n/);
  
  return lines
  .filter(row => row.trim() !== '')
  .map(row => {
    const [word, ...rest] = row.split(',');
    const definition = rest.join(','); // Join the rest back together
    return { word, definition };
  });
}

module.exports = { parseCSVFile }