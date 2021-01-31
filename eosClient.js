require('dotenv').config()

const { JsonRpc, Api } = require('eosjs')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only

const fetch = require('node-fetch')
const util = require('util')
const zlib = require('zlib')

const textEncoder = new util.TextEncoder()
const textDecoder = new util.TextDecoder()

const rpc = new JsonRpc('https://node.hypha.earth', {
    fetch
})

const defaultPrivateKey = process.env.SERVICE_PRIVATE_KEY
const signatureProvider = new JsSignatureProvider([defaultPrivateKey])

const api = new Api({
    rpc,
    signatureProvider,
    textDecoder,
    textEncoder,
})

module.exports = api