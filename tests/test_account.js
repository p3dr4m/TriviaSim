let account = require('../models/account')

describe('testing account.js', () => {
  let accInstance = new account.Account()
  test('account login', () => {
    expect(accInstance.login('pedram', 'password')).toBeTruthy()
  })
})