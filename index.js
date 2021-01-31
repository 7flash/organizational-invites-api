const fastify = require('fastify')({ logger: true })

const findSponsor = require('./findSponsor')
const { generateInvite } = require('./generateInvite')
const generateLink = require('./generateLink')
const eosClient = require('./eosClient')

const defaultSowQuantity = "5.0000 SEEDS"

fastify.get('/', async (request, response) => {
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