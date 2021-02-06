const { describe } = require('riteway')
const checkAccountExists = require('./checkAccountExists')

describe('Check account exists', async assert => {
    assert({
        given: 'existing account name',
        should: 'return true',
        actual: checkAccountExists('sevenflash42'),
        expected: true
    })

    assert({
        given: 'non-existing account name',
        should: 'return false',
        actual: checkAccountExists('sevenflash45'),
        expected: false
    })
})