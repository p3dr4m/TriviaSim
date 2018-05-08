/* eslint-env jest */
const opentdb = require.requireActual('../models/opentdb')

const promiseTest = opentdb.getQuestions()
const invalidPromiseTest = opentdb.getQuestions
const invalidPromiseTestCatch = opentdb.getQuestions(
  numberofQuestions = 1,
  category = 1,
  difficulty = 1,
  questionType = 2
)

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
})
