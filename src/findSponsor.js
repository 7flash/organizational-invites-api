const sponsors = require('../data/sponsors.json')

const findSponsor = (apiKey) => sponsors[apiKey]

module.exports = findSponsor