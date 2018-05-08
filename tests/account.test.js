const opentdb = require('../models/opentdb')
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

const invalidPromiseTest = opentdb.getQuestions

describe('Testing user registration/login', () => {
  let accInst = new Account.Account()
  test('Registering users work as expected', async () => {
    let username = 'jestUser'
    let password = 'jestUser'
    await expect(accInst.register(username, password)).resolves.toEqual(true)
  })

  test('Login work as expected', async () => {
    let username = 'jestUser'
    let password = 'jestUser'
    await expect(accInst.login(username, password)).resolves.toEqual(true)
  })
})