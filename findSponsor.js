const sponsors = require('./sponsors.json')

const findSponsor = (apiKey) => sponsors[apiKey]

module.exports = findSponsor