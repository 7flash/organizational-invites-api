const accounts = require('./accounts.json')

const findAccountByPhone = phoneNumber => accounts[phoneNumber]

module.exports = findAccountByPhone