const { describe } = require('riteway')
const sendNotification = require('../src/sendNotification')

describe('Send notification', async assert => {
    assert({
        given: 'send notification',
        should: 'user receive notification',
        actual: typeof sendNotification("sevenflash42", "encodedtransaction"),
        expected: "undefined",
    })
})