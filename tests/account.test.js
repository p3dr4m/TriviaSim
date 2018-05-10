/* eslint-env jest */
const opentdb = require('../models/opentdb')
const db = require('../models/database')
const questions = require('../controllers/questions')
const usersM = require('../models/users')
const Account = require('../models/account')
const promiseTest = opentdb.getQuestions()
const invalidPromiseTestCatch = opentdb.getQuestions(
  numberofQuestions = 1,
  category = 1,
  difficulty = 1,
  questionType = 2
)

beforeAll(() => {
  db.executeQuery(`DELETE FROM public."ACCOUNTS"`)
})

const invalidPromiseTest = opentdb.getQuestions

describe('Testing user registration/login', () => {
  let accInst = new Account.Account()

  test('Validating correct passwords', async () => {
    let password = ['hello1P', '123Hello123', '!@#Test3213!@##']
    for (let i = 0; i < password.length; i++) {
      await expect(accInst.validatePassword(password[i])).toEqual(true)
    }
  })

  test('Rejecting wrong passwords', async () => {
    let wrongPassArr = ['hello', 'hello1', 'HELLO', '12312%$^#']
    for (let i = 0; i < wrongPassArr.length; i++) {
      await expect(accInst.validatePassword(wrongPassArr[i])).toEqual(false)
    }
  })

  test('Validating username ', async () => {
    let username = 'Hello1'
    await expect(accInst.validateUsername(username)).resolves.toEqual(true)
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
})
