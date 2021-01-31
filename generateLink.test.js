const { describe } = require('riteway')

const generateLink = require('./generateLink')

describe('Generate Link', async assert => {
    const mockSecret = '354b5a4459503358683463574852337a6231785a714d47624b6e6f6a6d506533'
    const mockDynamicLink = 'https://seedswallet.page.link/JAD1613eDyrvxtjb7'
    
    const dynamicLink = await generateLink(mockSecret)

    assert({
        given: 'invite secret',
        should: 'generate dynamic link',
        actual: dynamicLink.length,
        expected: mockDynamicLink.length
    })
})