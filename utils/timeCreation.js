const moment = require('moment')

function calculateTimeSinceCreation (createdAt) {
  const currentDate = new Date()
  const creationDate = moment(createdAt, 'DD/MM/YYYY HH:mm:ss')

  const duration = moment.duration(currentDate - creationDate)

  const days = Math.floor(duration.asDays())
  const hours = Math.floor(duration.asHours() % 24)

  return `${days} days and ${hours} hours`
}

module.exports = { calculateTimeSinceCreation }