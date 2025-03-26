const cron = require('node-cron')
const { fetchAndCacheTLDList } = require('./fetchDomainList.js')

// ~ schedule to run every week (sunday at @ 6 pm)
/* cron syntax
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week (0 or 7 are sunday)
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
 */
cron.schedule('0 0 18 * * 7', async () => {
  try {
    const totalItems = await fetchAndCacheTLDList() // this func will trigger the fetching and will update
    const currentDate = new Date().toLocaleString()

    console.log('Fetched and cached TLD list of', totalItems, 'domains.')
    console.log(`[${currentDate}] Updated TLD fetching`)

  } catch (error) {
    console.error('Error fetching and caching data:', error)
  }
}, {
  scheduled: true,
  timezone: 'Europe/Brussels'
})
