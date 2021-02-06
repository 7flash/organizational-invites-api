const { describe } = require('riteway')
const encodeTransaction = require('./encodeTransaction')

describe('encode transaction', async assert => {
    const result = await encodeTransaction({
        callbackUrl: 'http://localhost/',
        from: 'sevenflash42',
        to: 'igorberlenko',
        memo: 'payment details',
        quantity: '7.0000 SEEDS',
    })

    console.log('result', result)
    
    assert({
        given: 'encodeTransaction called',
        should: 'return signing request',
        actual: typeof result,
        expected: 'string'
    })
})