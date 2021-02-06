const { describe } = require('riteway')
const findAccountByPhone = require('./findAccountByPhone')

describe('Find account by phone', async assert => {
    assert({
        given: 'phone number',
        should: 'return account name',
        actual: findAccountByPhone("1111111111"),
        expected: "sevenflash42" 
    })
})