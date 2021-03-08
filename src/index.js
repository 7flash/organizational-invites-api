const fastify = require('fastify')({ logger: true })
const assert = require('assert')

const findSponsor = require('./findSponsor')
const { generateInvite } = require('./generateInvite')
const generateLink = require('./generateLink')
const eosClient = require('./eosClient')
const findAccountByPhone = require('./findAccountByPhone')
const encodeTransaction = require('./encodeTransaction')
const sendNotification = require('./sendNotification')
const checkAccountExists = require('./checkAccountExists')

const defaultSowQuantity = "5.0000 SEEDS"

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
fastify.post('/send_invoice', async (request, response) => {
    try {
        if (request.body.bill_to_account) {
            assert(checkAccountExists(request.body.bill_to_account), `value of bill_to_account is expected to be an existing account name, but provided value is ${request.body.bill_to_account}`)
        }
        if (request.body.bill_to_phone) {
            assert(!request.body.bill_to_account, `exclusively bill_to_account or bill_to_phone are expected, but both values are provided`)
            assert(findAccountByPhone(request.body.bill_to_phone), `value of bill_to_phone is expected to be a phone number associated with existing account, but provided value is ${request.body.bill_to_phone}`)
        }

        assert(request.body.recipient, `value of recipient field is expected to be a valid account name, but empty value provided`)
        assert(checkAccountExists(request.body.recipient), `value of recipient field is expected to be an existing account name, but provided value is ${request.body.recipient}`)
        
        assert(parseFloat(request.body.total) > 0, `value of total field is expected to be a valid number, but provided value is ${request.body.total}`)
        
        assert(request.body.callback_url.startsWith('https://'), `value of callback_url field is expected to be valid https url, but provided value is ${request.body.callback_url}`)

        var from = request.body.bill_to_phone ? findAccountByPhone(request.body.bill_to_phone) : request.body.bill_to_account;
        var to = request.body.recipient
        var memo = request.body.memo || ""
        var quantity = parseFloat(request.body.total).toFixed(4) + " SEEDS";

        var callbackUrl = request.body.callback_url;

        const esr = await encodeTransaction({
            from, to, quantity, memo, callbackUrl
        })

        sendNotification(from, esr)

        return {
            ok: true,
            result: esr
        }
    } catch (err) {
        return {
            ok: false,
            error: err.toString()
        }
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