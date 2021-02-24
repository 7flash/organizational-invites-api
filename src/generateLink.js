require('dotenv').config()

const request = require('request')

const apiKey = process.env.FIREBASE_API_KEY

const generateLink = (inviteSecret) => {
    const body = {
        'dynamicLinkInfo': {
            'domainUriPrefix': 'https://seedswallet.page.link',
            'link': `https://joinseeds.com/?placeholder=&inviteMnemonic=${inviteSecret}`,
            'androidInfo': {
                'androidPackageName': 'com.joinseeds.seedswallet'
            },
            'iosInfo': {
                'iosBundleId': 'com.joinseeds.seedslight'
            }
        },
    }

    return new Promise((resolve, reject) => {
        request({
            url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`,
            method: 'POST',
            json: true,
            body
        }, function (error, response) {
            if (error) return reject(error)

            if (response && response.statusCode !== 200) return reject(response.body.error)

            const link = response.body.shortLink

            resolve(link)
        })   
    })
}

module.exports = generateLink