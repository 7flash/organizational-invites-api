const fastify = require('fastify')({ logger: true })
const assert = require('assert')
const fetch = require('node-fetch')

const findSponsor = require('./findSponsor')
const { generateInvite } = require('./generateInvite')
const generateLink = require('./generateLink')
const eosClient = require('./eosClient')
const findAccountByPhone = require('./findAccountByPhone')
const encodeTransaction = require('./encodeTransaction')
const sendNotification = require('./sendNotification')
const checkAccountExists = require('./checkAccountExists')

const defaultSowQuantity = "5.0000 SEEDS"

const fs = require('fs')


var apiKeys

fs.readFile('apiKeys.json', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log("api file: ",data)
  const json = JSON.parse(data)
  apiKeys = json.map( (e) => e.key)

  console.log("api keys ", apiKeys)
})


/**
 * TODO Invoice format to send to backend is this
 {
    "apiKey":"xxx",
    "invoice":{
        "memo":"1",
        "amount":"700.0000 SEEDS",
        "recipient":"testingseed3",
        "items":[
            {
                "name":"faux fur",
                "quantity":1,
                "pricePerItem":"50.0000 SEEDS"
            }
        ]
    },
    "user":"illumination"
    // OR 
    // Either target user or target phone number must be defined
    "phoneNumber":"+14155555555"
}
Then all that needs to be sent off to firebase, which handles all the arror cases and sends the push notifications
 */

const checkApiKey = (key) => {
    console.log("check api keys ", apiKeys, " vs ", key)
    return apiKeys.includes(key)
}

fastify.post('/send_invoice', async (request, response) => {
    try {
        const { INVOICE_URL, FIREBASE_API_KEY } = process.env
        
        if (!checkApiKey(request.body.apiKey)) {
            console.log("bad API key")
            response.code(400)
            return {
                ok: false,
                error: "invalid API key"
            }
        }

        var body = {
            apiKey: FIREBASE_API_KEY,
            invoice: request.body.invoice,
        }
        if (request.body.phoneNumber) {
            body.phoneNumber = request.body.phoneNumber
        } else if (request.body.user) {
            body.user = request.body.user
        }

        console.log("posting "+JSON.stringify(body))

        const res = await fetch(INVOICE_URL, {
            method: 'post',
            body:    JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })
        
        const resJson = await res.json()

        if (res.status == 200) {
            console.log("result: ", resJson)
        } else {
            console.error("error: "+JSON.stringify(payload, null, 2))
            console.error("error response: "+JSON.stringify(res, null, 2))
        }

        return resJson
    } catch (err) {
        response
            .code(400)
            .send({
                ok: false,
                error: err.toString()
            })
    }
})

fastify.get('/invite', async (request, response) => {
    const { apiKey, amount } = request.query

    const sponsor = findSponsor(apiKey)

    if (sponsor == null) return { error: `Sponsor not found by api key ${apiKey}` }

    const quantity = parseFloat(amount).toFixed(4) + " SEEDS"

    const { secret, hash } = await generateInvite()

    const inviteLink = await generateLink(secret)

    eosClient.transact({
        actions: [{
            account: 'shrine.seeds',
            name: "createinvite",
            authorization: [{
                actor: "shire.seeds",
                permission: "door"
            }],
            data:  {
                sponsor: sponsor,
                transfer_quantity: quantity,
                sow_quantity: defaultSowQuantity,
                hash: hash,
            },
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30
    })

    return { inviteLink }
})

const main = async () => {
    try {
        await fastify.listen(process.env.LISTEN_PORT)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

main()