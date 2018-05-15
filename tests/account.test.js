/* eslint-env jest */
const db = require.requireActual('../models/database')
const Account = require.requireActual('../models/account')

beforeAll(() => {
  db.executeQuery(
    `CREATE TABLE IF NOT EXISTS public."ACCOUNTS"
  (
    "ACCOUNT_ID" bigint NOT NULL DEFAULT nextval('"ACCOUNTS_ACCOUNT_ID_seq"'::regclass),
    "USERNAME" character varying(50) NOT NULL,
    "PASSWORD" character varying(100) NOT NULL,
    CONSTRAINT "ACCOUNTS_pkey" PRIMARY KEY ("ACCOUNT_ID")
  )
  WITH {
    OIDS=FALSE
  );`
  ).catch(error => {
    return error
  })

  db.executeQuery(
    `CREATE TABLE IF NOT EXISTS public."SCORES"
  (
    "SCORE_ID" bigint NOT NULL DEFAULT nextval('"SCORES_SCORE_ID_seq"'::regclass),
    "ACCOUNT_ID" bigint NOT NULL,
    "SCORE" double precision NOT NULL,
    "HIGHEST_STREAK" smallint NOT NULL,
    "DATE" date NOT NULL,
    CONSTRAINT "SCORES_pkey" PRIMARY KEY ("SCORE_ID"),
    CONSTRAINT "SCORE_ACCOUNT" FOREIGN KEY ("ACCOUNT_ID")
        REFERENCES public."ACCOUNTS" ("ACCOUNT_ID") MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
  )
  WITH (
    OIDS=FALSE
  );`
  ).catch(error => {
    return error
  })

  db.executeQuery(
    `CREATE TABLE IF NOT EXISTS public."QUESTIONS"
  (
    "QUESTION_ID" bigint NOT NULL DEFAULT nextval('"QUESTIONS_QUESTION_ID_seq"'::regclass),
    "QUESTION_CONTENT" character varying(1000),
    "RIGHT_ANSWER" character varying(1000),
    "WRONG_ANSWER1" character varying(1000),
    "WRONG_ANSWER2" character varying(1000),
    "WRONG_ANSWER3" character varying(1000),
    "ACCOUNT_ID" bigint,
    CONSTRAINT "QUESTIONS_pkey" PRIMARY KEY ("QUESTION_ID"),
    CONSTRAINT "FK_ACCOUNT_QUESTION" FOREIGN KEY ("ACCOUNT_ID")
        REFERENCES public."ACCOUNTS" ("ACCOUNT_ID") MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
  )
  WITH (
    OIDS=FALSE
  );`
  ).catch(error => {
    return error
  })
  return undefined
})

afterAll(() => {
  db.executeQuery(`DELETE FROM public."ACCOUNTS" WHERE "USERNAME" IN (
  'jestUser1',
  'tester1',
  'tester2',
  'tester3'
  );`)
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

describe('register() tests', () => {
  let accInst = new Account.Account()
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

  it('should resolve True because user names do NOT exist in DB', async () => {
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
      }).catch(error => {
        expect(error.message).toBe('Bad Username')
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
  let accInst = new Account.Account()

  beforeEach(() => {
    accInst = new Account.Account()
  })

  afterEach(function () {
    accInst = undefined
  })

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
  let accInst = new Account.Account()
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
    await accInst.saveCurrentScore().then(result => {
      expect(result).toBeTruthy()
    }).catch(error => {
      return error
    })
  })
})

describe('Test encryptPassword()', () => {
  let accInst = new Account.Account()

  test('unencrypted password should not equal encrypted', async () => {
    await accInst.encryptPassword('Hello1').then(result => {
      expect(result).not.toBe('Hello1')
    }).catch(error => {
      console.log(error)
    })
  })
})