const { describe } = require('riteway')

const { generateInvite, generateSecret, generateHash } = require('../src/generateInvite')

describe('Generate Invite', async assert => {
    const mockPrivateKey = "5KZDYP3Xh4cWHR3zb1xZqMGbKnojmPe3p2EHnU7RLW4fnNaktgH"

    const secret = await generateSecret()
    assert({
        given: "generateSecret",
        should: "return string",
        actual: typeof secret,
        expected: "string"
    })

    assert({
        given: "generateHash from privateKey",
        should: "return expected hash",
        actual: generateHash(mockPrivateKey),
        expected: "e9cc68f15cf2241d287913a4d78c337ee12c2ecb9aba9e6eca29f8ffd982cfc3"
    })

    const newInvite = await generateInvite()
    assert({
        given: 'generateInvite',
        should: 'return secret and hash',
        actual: {
            secret: typeof newInvite.secret,
            hash: typeof newInvite.hash,
        },
        expected: {
            secret: "string",
            hash: "string"
        }
    })
})