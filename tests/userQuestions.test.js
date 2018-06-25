/* eslint-env jest */
const userQuestions = require.requireActual('../models/userQuestions')
const db = require.requireActual('../models/database')

beforeAll(async () => {
  let date = new Date()
  let timeStamp = `${date.toLocaleDateString('en-CA')} 
      ${date.toLocaleTimeString('en-CA')}`
  await db.executeQuery(
    `INSERT INTO public."ACCOUNTS" VALUES ($1, $2, $3);`, ['0', 'test', 'test'])
    .then(result => {
      return result
    })
  await db.executeQuery(
    `INSERT INTO public."QUESTIONS" VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`, ['0', 'test', 'test', 'test', 'test', 'test', '0', timeStamp])
    .then(result => {
      return result
    })
  await db.executeQuery(
    `INSERT INTO public."QUIZ_CATEGORY" VALUES ($1, $2);`, [0, 'test'])
    .then(result => {
      return result
    })
  await db.executeQuery(
    `INSERT INTO public."QUIZ_DIFFICULTY" VALUES ($1, $2);`, [0, 'test'])
    .then(result => {
      return result
    })
})

afterAll(async () => {
  await db.executeQuery(
    `DELETE FROM public."QUESTIONS" WHERE "QUESTION_CONTENT" =` +
    `'What is my name?';`, [])
  await db.executeQuery(
    `DELETE FROM public."ACCOUNTS" WHERE "USERNAME" = 'test';`, [])
})

test('Test if createQuestion works', async () => {

  let date = new Date()
  let timeStamp = `${date.toLocaleDateString('en-CA')} 
      ${date.toLocaleTimeString('en-CA')}`
  await userQuestions.createQuestion(
    'What is my name?',
    'Shanyu',
    'Pedram',
    'Derek',
    'Maksym',
    '0',
    timeStamp
  ).then(result => {
    expect.assertions(1)
    expect(result).toBeTruthy()
  })
})

test('Test if createQuestion validation works (empty input)', async () => {
  await userQuestions.createQuestion(
    'What is my name?',
    '',
    'Pedram',
    'Derek',
    'Maksym',
    0
  ).then(result => {
    expect.assertions(1)
    expect(result).toBeFalsy()
  })
})

test('Test if createQuestion validation works (same answers)', async () => {
  await userQuestions.createQuestion(
    'What is my name?',
    'Shanyu',
    'Shanyu',
    'Derek',
    'Maksym',
    0
  ).then(result => {
    expect.assertions(1)
    expect(result).toBeFalsy()
  })
})

it('should ', () => {
  db.executeQuery(
    `SELECT * FROM public."ACCOUNTS";`
  ).then(res1 => {
    expect.assertions(2)
    expect(res1).toBeTruthy()
  })
})

test('Test if getRandomQuestions() works', async () => {
  expect.assertions(1)
  await expect(userQuestions.getRandomQuestions()).resolves.toBeTruthy()
})

test('Test createCustomQuiz()', async () => {
  let accID = '0'
  let qName = 'qweqwe'
  let date = new Date()
  let timeStamp = `${date.toLocaleDateString('en-CA')} 
      ${date.toLocaleTimeString('en-CA')}`
  let qList = ['0']
  await expect(userQuestions.createCustomQuiz(accID, qName, timeStamp, qList)).resolves.toBeTruthy()
})
