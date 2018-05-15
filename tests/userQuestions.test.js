/* eslint-env jest */
const userQuestions = require.requireActual('../models/userQuestions')
const db = require.requireActual('../models/database')

beforeAll(async () => {
  await db.executeQuery(`INSERT INTO public."ACCOUNTS" VALUES (0, 'test', 'test');`).then(result => {
    return result
  })
})

afterAll(() => {
  db.executeQuery(`DELETE FROM public."QUESTIONS" WHERE "QUESTION_CONTENT" = 'What is my name?';`)
  db.executeQuery(`DELETE FROM public."ACCOUNTS" WHERE "USERNAME" = 'test';`)
})

test('Test if createQuestion works', async () => {
  await userQuestions.createQuestion(
    'What is my name?',
    'Shanyu',
    'Pedram',
    'Derek',
    'Maksym',
    0
  ).then(result => {
    expect(result).toBeTruthy()
  }).catch(error => {
    console.log(error)
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
    expect(result).toEqual(false)
  }).catch(error => {
    console.log(error)
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
    expect(result).toEqual(false)
  }).catch(error => {
    console.log(error)
  })
})
it('should ', () => {
  db.executeQuery(
    `SELECT * FROM public."ACCOUNTS";`
  ).then(res1 => {
    console.log(res1)
  })
})
