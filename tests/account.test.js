/* eslint-env jest */
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

describe('Testing the Open Trivia Database API', () => {
  test('Check data structure', () => {
    let testStructure = {
      question: expect.anything(),
      option1: expect.anything(),
      option2: expect.anything(),
      option3: expect.anything(),
      option4: expect.anything(),
      answers: expect.anything()
    }
    expect.assertions(1)
    return promiseTest.then(data => {
      console.log(data[0])
      expect(data[0]).toEqual(testStructure)
    })
  })

  test('Test Invalid Parameter Rejection using reject', () => {
    expect(invalidPromiseTest(
      numberofQuestions = 1,
      category = 1,
      difficulty = 1,
      questionType = 2
    )).rejects.toThrow('Invalid Parameter')
  })

  test('Promise test 2 by catching error and comparing the message', () => {
    expect.assertions(1)
    return invalidPromiseTestCatch.catch(error => {
      console.log(error.message)
      expect(error.message).toBe('Invalid Parameter')
    })
  })

  test('test getQuestions', () => {
    let testStructure = {
      question: expect.anything(),
      option1: expect.anything(),
      option2: expect.anything(),
      option3: expect.anything(),
      option4: expect.anything()
    }
    let instanceQuestions = new questions.Questions()
    expect.assertions(1)
    return instanceQuestions.getQuestions().then(data => {
      expect(data[0]).toEqual(testStructure)
    })
  })
})

describe('Testing methods in Question Class', () => {
  test('Testing assessQuestionResult; Answer True', () => {
    let instanceQuestions = new questions.Questions()
    let instanceUser = new usersM.User()

    instanceQuestions.getQuestions().then(data => {
      instanceQuestions.questionsList[1].answers = 1
      expect(instanceQuestions.assessQuestionResult(instanceUser, 1, 1)).toEqual({
        result: true,
        currentUser: instanceUser
      })
    })
  })

  test('Testing assessQuestionResult; Answer False', () => {
    let instanceQuestions = new questions.Questions()
    let instanceUser = new usersM.User()
    instanceQuestions.getQuestions().then(data => {
      instanceQuestions.questionsList[1].answers = 1
      expect(instanceQuestions.assessQuestionResult(instanceUser, 1, 2)).toEqual({
        result: false,
        currentUser: instanceUser
      })
    })
  })
})

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

test('testing database connection local', () => {
  const db = require('../models/database')
  expect(db.getUsersList()).toBe('test')
})
