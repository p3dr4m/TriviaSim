/* eslint-env jest */
const db = require('../models/database')
const Account = require('../models/account')

beforeAll(() => {
  return undefined
})

afterAll(() => {
  return undefined
})

/**
 * If beforeEach is inside a describe block, it runs for each test in the describe block.
 */
beforeEach(() => {
  return undefined
})

/**
 * If afterEach is inside a describe block, it runs for each test in the describe block.
 */
afterEach(() => {
  return undefined
})

beforeAll(() => {
  db.executeQuery(`DELETE FROM public."ACCOUNTS"`)
})

describe('Testing user registration/login', () => {
  let accInst = new Account.Account()

  test('Validating correct passwords', async () => {
    let password = ['hello1P', '123Hello123', '!@#Test3213!@##']
    for (let i = 0; i < password.length; i++) {
      await expect(accInst.validatePassword(password[i])).toBeTruthy()
    }
  })

  test('Rejecting wrong passwords', async () => {
    let wrongPassArr = ['hello', 'hello1', 'HELLO', '12312%$^#']
    for (let i = 0; i < wrongPassArr.length; i++) {
      await expect(accInst.validatePassword(wrongPassArr[i])).toBeFalsy()
    }
  })

  test('Registering users work as expected', async () => {
    let username = 'jestUser1'
    let password = 'jestUser'
    await expect(accInst.register(username, password)).resolves.toEqual(true)
  })

  test('Login work as expected', async () => {
    let username = 'jestUser1'
    let password = 'jestUser'
    await expect(accInst.login(username, password)).resolves.toEqual(true)
  })

  test('should resolve false for bad usernames', async () => {
    let badUsername = ['@@@13123asdasdASDADS', '0123456789012345678901234567890123456789', 'asd\n123\n']
    for (let i = 0; i < badUsername.length; i++) {
      await expect(accInst.regexUsername(badUsername[i])).toBeFalsy()
    }
  })

  test('Validating username ', async () => {
    let username = 'Hello1'
    await expect(accInst.validateUsername(username)).resolves.toBeTruthy()
  })

  test('should resolve truthy because valid usernames', async () => {
    let goodUsername = ['as54d4535', 'DDsad3123']
    for (let i = 0; i < goodUsername.length; i++) {
      await expect(accInst.validateUsername(goodUsername[i])).toBeTruthy()
    }
  })
})
