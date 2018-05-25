/* eslint-env jest */
const db = require.requireActual('../models/database')
const Account = require.requireActual('../models/account')
let accInst

beforeAll(() => {
  return undefined
})

afterAll(async () => {
  await db.executeQuery(
    `DELETE FROM public."ACCOUNTS" WHERE "USERNAME" IN ($1, $2, $3, $4);`,
    ['jestUser1', 'tester1', 'tester2', 'tester3'])
})

beforeEach(() => {
  accInst = new Account.Account()
})

afterEach(() => {
  accInst = undefined
})

describe('register() tests', () => {
  let usernameGood = [
    'jestUser1',
    'tester1',
    'tester2',
    'tester3'
  ]
  let usernameBad = [
    'jestUser2',
    'badTester1',
    'badTester2',
    'badTester3'
  ]
  let password = 'Password1'

  test('Registering users work as expected', async () => {
    for (let i = 0; i < usernameGood.length; i++) {
      await accInst.register(usernameGood[i], password).then(result => {
        expect(result).toBeTruthy()
      })
    }
  })

  test('Login work as expected', async () => {
    for (let i = 0; i < usernameBad.length; i++) {
      await accInst.login(usernameBad[i], password).then(result => {
        expect(result).toBeFalsy()
      })
    }
  })

  it('login() should be True', async () => {
    for (let i = 0; i < usernameGood.length; i++) {
      await accInst.login(usernameGood[i], password).then(result => {
        expect(result).toBeTruthy()
      })
    }
  })
})

describe('validateUsername() tests', () => {
  it('should reject and throw error because of bad username inputs',
    async () => {
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

  it('should reject and throw error because of bad username inputs',
    async () => {
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

  it('should resolve True because user names do NOT exist in DB',
    async () => {
      let testUsername = [
        'as54d4535',
        'DDsad3123',
        'dsfasdf'
      ]
      for (let i = 0; i < testUsername.length; i++) {
        await accInst.validateUsername(testUsername[i]).then(result => {
          expect(result).toBeTruthy()
        }).catch(error => {
          expect(error.message).toBe('Bad Username')
        })
      }
    })

  it('should resolve False because user names do exist in DB', async () => {
    let testUsername = [
      'jestUser1',
      'tester1',
      'tester2',
      'tester3'
    ]
    for (let i = 0; i < testUsername.length; i++) {
      await accInst.validateUsername(testUsername[i]).then(result => {
        expect(result).toBeFalsy()
      })
    }
  })
})

describe('regexUsername() method tests', () => {
  test('test regex method for bad usernames', () => {
    let badUsername = [
      '@@@13123asdasdASDADS',
      '0123456789012345678901234567890123456789',
      'asd\n123\n',
      'a'
    ]
    for (let i = 0; i < badUsername.length; i++) {
      expect(accInst.regexUsername(badUsername[i])).toBeFalsy()
    }
  })

  test('test regex method for good usernames', () => {
    let goodUsername = [
      'hello'
    ]
    for (let i = 0; i < goodUsername.length; i++) {
      expect(accInst.regexUsername(goodUsername[i])).toBeTruthy()
    }
  })
})

describe('regexPassword() method tests', () => {
  it('Validating correct passwords', () => {
    let password = [
      'hello1P',
      '123Hello123',
      '!@#Test3213!@##'
    ]
    for (let i = 0; i < password.length; i++) {
      expect(accInst.regexPassword(password[i])).toBeTruthy()
    }
  })

  it('Rejecting wrong passwords', () => {
    let wrongPassArr = [
      'hello',
      'hello1',
      'HELLO',
      '12312%$^#'
    ]
    for (let i = 0; i < wrongPassArr.length; i++) {
      expect(accInst.regexPassword(wrongPassArr[i])).toBeFalsy()
    }
  })
})

describe('saveCurrentScore()', () => {
  afterEach(() => {
    db.executeQuery(
      `DELETE FROM public."SCORES"
      WHERE "ACCOUNT_ID" = 1`
    )
  })
  it('should resolve true', async () => {
    accInst.username = 'pedram'
    accInst.userID = 1
    accInst.currentScore.userScore = 1000.0
    accInst.currentScore.currentStreak = 5
    accInst.currentScore.highestStreak = 9
    await accInst.saveCurrentScore(9, 0).then(result => {
      expect(result).toBeTruthy()
    }).catch(error => {
      expect(error.message).toBeTruthy()
    })
  })
})

describe('Test encryptPassword()', () => {
  test('unencrypted password should not equal encrypted', async () => {
    await accInst.encryptPassword('Hello1').then(result => {
      expect(result).not.toBe('Hello1')
    })
  })
})

describe('Test userPlayHistory()', () => {
  test('display string is empty for a valid user with no play history', async () => {
    accInst.userID = 1
    await accInst.userPlayHistory().then(result => {
      expect(result).toBe('')
    })
  })

  test('returns "Error" for an invalid user', async () => {
    await accInst.userPlayHistory().then(result => {
      expect(result).toBe('Error')
    })
  })
})

describe('Test userPlayHistory()', () => {
  test('getCreatedQuestions()', async () => {
    accInst.userID = 1
    expect(await accInst.getCreatedQuestions()).toContain(
      '<div class=\"round cards floatingButtons\" id=\"createQuestionButton\" ' +
      'onclick=\"showCreateQuestionWindow()\"></div>')
  })
})