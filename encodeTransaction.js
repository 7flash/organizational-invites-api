const { JsonRpc, Api, Serialize } = require('eosjs')

const fetch = require('node-fetch')
const util = require('util')
const zlib = require('zlib')

const textEncoder = new util.TextEncoder()
const textDecoder = new util.TextDecoder()

const rpc = new JsonRpc('https://node.hypha.earth', {
    fetch
})

const eos = new Api({
    rpc,
    textDecoder,
    textEncoder,
})

const { SigningRequest } = require("eosio-signing-request")

const opts = {
    textEncoder,
    textDecoder,
    zlib: {
        deflateRaw: (data) => new Uint8Array(zlib.deflateRawSync(Buffer.from(data))),
        inflateRaw: (data) => new Uint8Array(zlib.inflateRawSync(Buffer.from(data))),
    },
    abiProvider: {
        getAbi: async (account) => (await eos.getAbi(account))
    }
}

async function encodeTransaction({ from, to, quantity, memo, callbackUrl }) {
    const request = await SigningRequest.create({
        action: {
            account: "token.seeds",
            name: "transfer",
            authorization: [{
                actor: from,
                permission: "active"        
            }],
            data: {
                from: from,
                to: to,
                quantity: quantity,
                memo: memo    
            },
        },
        callback: `${callbackUrl}/?sig={{sig}}&tx={{tx}}`
    }, opts);
    const uri = request.encode();
    return uri
}

module.exports = encodeTransaction