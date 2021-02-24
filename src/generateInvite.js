const ecc = require('eosjs-ecc')

const generateSecret = async () => {
    const privateKey = await ecc.randomKey()
    const secretBuffer = Buffer.from(privateKey)
    const secret = secretBuffer.toString('hex').substring(0, 64)
    return secret
}

const generateHash = (secret) => {
    const secretArray = new Uint8Array(secret.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
    const hash = ecc.sha256(secretArray).toString("hex")
    return hash
}

const generateInvite = async () => {
    const secret = await generateSecret()
    const hash = generateHash(secret)

    return { secret, hash }
}

module.exports = {
    generateSecret, generateHash, generateInvite
}