/* eslint-env jest */
const userQuestions = require('../models/userQuestions')
const db = require('../models/database')

beforeAll(() => {
  db.executeQuery(`DELETE FROM public."QUESTIONS" WHERE "QUESTION_CONTENT" = 'What is my name?';`)
})

test('Test if createQuestion works', async () => {
  await expect(userQuestions.createQuestion(
    'What is my name?',
    'Shanyu',
    'Pedram',
    'Derek',
    'Maksym',
    1
  )).resolves.toEqual(true)
})

test('Test if createQuestion validation works (empty input)', async () => {
  await expect(userQuestions.createQuestion(
    'What is my name?',
    '',
    'Pedram',
    'Derek',
    'Maksym',
    1
  )).resolves.toEqual(false)
})

test('Test if createQuestion validation works (same answers)', async () => {
  await expect(userQuestions.createQuestion(
    'What is my name?',
    'Shanyu',
    'Shanyu',
    'Derek',
    'Maksym',
    1
  )).resolves.toEqual(false)
})
