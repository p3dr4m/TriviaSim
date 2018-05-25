/* eslint-env jest */
const usersM = require.requireActual('../models/users')
const questions = require.requireActual('../controllers/questions')
const account = require.requireActual('../models/account')
const opentdb = require.requireActual('../models/opentdb')

let instanceQuestions
let instanceUser
let instanceUsers
let tokenID

beforeAll(async () => {
  instanceQuestions = new questions.Questions()
  instanceUser = new account.Account()
  instanceUser = new account.Account()
  await opentdb.retrieveToken().then(token => {
    tokenID = token
  })
})

afterAll(() => {
  return undefined
})

beforeEach(() => {
  return undefined
})

afterEach(() => {
  return undefined
})

describe('Testing methods in Question Class', () => {
  test('Testing assessQuestionResult; Answer True', () => {
    instanceQuestions.getQuestions(tokenID).then(data => {
      instanceQuestions.questionsList[1].answers = 1
      expect(instanceQuestions.assessQuestionResult(instanceUser, 1, 1))
        .toEqual({
          answer: instanceQuestions.questionsList[1][`option${1}`],
          result: true,
          currentUser: instanceUser
        })
    })
  })

  test('Testing assessQuestionResult; Answer False', () => {
    instanceQuestions.getQuestions(tokenID).then(data => {
      instanceQuestions.questionsList[1].answers = 1
      expect(instanceQuestions.assessQuestionResult(instanceUser, 1, 2))
        .toEqual({
          answer: instanceQuestions.questionsList[1][`option${1}`],
          result: false,
          currentUser: instanceUser
        })
    })
  })

  test('test double the user score if the answer to bonus question is correct',
    async () => {
      instanceQuestions.getQuestions(tokenID).then(data => {
        instanceQuestions.questionsList[10] = {
          'question': 'Hello',
          'option1': 'World',
          'option2': 'Hello',
          'option3': 'Again',
          'option4': '!',
          'answers': 1
        }
        instanceUser.currentScore.userScore = 500
        instanceQuestions.assessQuestionResult(instanceUser, 10, 1)
        expect(instanceUser.currentScore.userScore === 1000).toBe(true)
        instanceQuestions.assessQuestionResult(instanceUser, 10, 2)
        expect(instanceUser.currentScore.userScore).toBe(0)
      })
    })
})

describe('GetQuestions()', () => {
  let testStructure = {
    index: expect.anything(),
    question: expect.anything(),
    option1: expect.anything(),
    option2: expect.anything(),
    option3: expect.anything(),
    option4: expect.anything()
  }
  test('test getQuestions default', async () => {
    await instanceQuestions.getQuestions(tokenID).then(data => {
      expect(data[0]).toEqual(testStructure)
    })
  })

  it('should getQuestions() medium', async () => {
    await instanceQuestions.getQuestions(tokenID, 10, 15, 'medium')
      .then(data => {
        expect(data[0]).toEqual(testStructure)
      })
  })
  it('should getQuestions() medium', async () => {
    await instanceQuestions.getQuestions(tokenID, 10, 15, 'hard')
      .then(data => {
        expect(data[0]).toEqual(testStructure)
      })
  })
  it('should reject getQuestions', async () => {
    await instanceQuestions.getQuestions('asd', 'asd', 'asd').catch(error => {
      expect(error.message).toBeTruthy()
    })
  })
})

test('test storeQuizResult', async () => {
  expect(typeof instanceQuestions.storeQuizResult(instanceUsers))
    .toBe('string')
})
