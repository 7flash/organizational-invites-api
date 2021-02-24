const accounts = require('../data/accounts.json')

const findAccountByPhone = phoneNumber => accounts[phoneNumber]

module.exports = findAccountByPhone