const { describe } = require('riteway')

const findSponsor = require('./findSponsor')

describe('Find Sponsor', async assert => {
    const apiKey = "apikey1"
    
    assert({
        given: 'api key',
        should: 'find sponsor',
        actual: findSponsor(apiKey),
        expected: "sponsor1"
    })
})