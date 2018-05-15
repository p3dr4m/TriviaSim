/* eslint-env jest */
const userQuestions = require.requireActual('../models/userQuestions')
const db = require.requireActual('../models/database')

beforeAll(() => {
  db.executeQuery(
    `INSERT INTO public."ACCOUNTS" ("USERNAME", "PASSWORD") VALUES ('testName','testPassword');`
  ).then(result => {
    db.executeQuery(
      `SELECT * FROM public."ACCOUNTS";`
    ).then(res1 => {
      console.log(res1)
    })
  })
})

afterAll(() => {
  db.executeQuery(`DELETE FROM public."QUESTIONS" WHERE "QUESTION_CONTENT" = 'What is my name?';`)
})

test('Test if createQuestion works', async () => {
  await userQuestions.createQuestion(
    'What is my name?',
    'Shanyu',
    'Pedram',
    'Derek',
    'Maksym',
    1
  ).then(result => {
    expect(result).toBe('a')
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
    1
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
    1
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
