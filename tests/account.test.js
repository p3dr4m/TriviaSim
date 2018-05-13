/* eslint-env jest */
const db = require.requireActual('../models/database')
const Account = require.requireActual('../models/account')

beforeAll(() => {
  // db.executeQuery(`DELETE FROM public."ACCOUNTS" WHERE "USERNAME" = 'jestUser1';`)
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

describe('Testing user registration/login', () => {
  let accInst = new Account.Account()

  test('Registering users work as expected', async () => {
    let username = 'jestUser1'
    let password = 'Password1'
    await expect(accInst.register(username, password)).resolves.toBeTruthy()
  })

  test('Login work as expected', async () => {
    let username = 'jestUser1'
    let password = 'Password1'
    await expect(accInst.login(username, password)).resolves.toBeTruthy()
  })
})

describe('validateUsername() tests', () => {
  let accInst = new Account.Account()

  it('should reject and throw error because of bad username inputs', async () => {
    let badUsername = [
      '@@@13123asdasdASDADS',
      '0123456789012345678901234567890123456789',
      'asd\n123\n',
      'a'
    ]
    for (let i = 0; i < badUsername.length; i++) {
      await accInst.validateUsername(badUsername[i]).catch(error => {
        expect(error.message).toBe('Bad Username')
      })
    }
  })

  it('should reject and throw error because of bad username inputs', async () => {
    let badUsername = [
      '@@@13123asdasdASDADS',
      '0123456789012345678901234567890123456789',
      'asd\n123\n',
      'a'
    ]
    for (let i = 0; i < badUsername.length; i++) {
      await accInst.validateUsername(badUsername[i]).catch(error => {
        expect(error.message).toBe('Bad Username')
      })
    }
  })

  it('should resolve truthy because valid usernames', async () => {
    let testUsername = [
      'as54d4535',
      'DDsad3123',
      'dsfasdf'
    ]
    for (let i = 0; i < testUsername.length; i++) {
      await accInst.validateUsername(testUsername[i]).then(result => {
        expect(result).toBeTruthy()
      }).catch(error => {
        expect(error.message).toBe('Username Not Found')
      })
    }
  })

  it('should resolve truthy because valid usernames', async () => {
    let testUsername = [
      'jestUser1',
      'test',
      'pedram123'
    ]
    for (let i = 0; i < testUsername.length; i++) {
      await accInst.validateUsername(testUsername[i]).then(result => {
        expect(result).toBeFalsy()
      }).catch(error => {
        expect(error.message).toBe('Username Not Found')
      })
    }
  })
})

describe('regexUsername() method tests', () => {
  let accInst = new Account.Account()

  beforeEach(() => {
    accInst = new Account.Account()
  })

  afterEach(function () {
    accInst = undefined
  })

  test('test regex method for bad usernames', () => {
    let badUsername = ['@@@13123asdasdASDADS', '0123456789012345678901234567890123456789', 'asd\n123\n', 'a']
    for (let i = 0; i < badUsername.length; i++) {
      expect(accInst.regexUsername(badUsername[i])).toBeFalsy()
    }
  })

  test('test regex method for good usernames', () => {
    let goodUsername = ['hello']
    for (let i = 0; i < goodUsername.length; i++) {
      expect(accInst.regexUsername(goodUsername[i])).toBeTruthy()
    }
  })
})

describe('regexPassword() method tests', () => {
  let accInst = new Account.Account()

  beforeEach(() => {
    accInst = new Account.Account()
  })

  afterEach(function () {
    accInst = undefined
  })

  it('Validating correct passwords', () => {
    let password = ['hello1P', '123Hello123', '!@#Test3213!@##']
    for (let i = 0; i < password.length; i++) {
      expect(accInst.regexPassword(password[i])).toBeTruthy()
    }
  })

  it('Rejecting wrong passwords', () => {
    let wrongPassArr = ['hello', 'hello1', 'HELLO', '12312%$^#']
    for (let i = 0; i < wrongPassArr.length; i++) {
      expect(accInst.regexPassword(wrongPassArr[i])).toBeFalsy()
    }
  })
})
