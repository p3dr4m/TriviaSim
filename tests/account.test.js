/* eslint-env jest */
const account = require.requireActual('../models/account')
const db = require.requireActual('../models/database')

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

describe('Testing user registration/login', () => {
  test('Registering users work as expected', async () => {
    let accInst = new account.Account()
    let username = 'jestUser'
    let password = 'jestUser1'
    await expect(accInst.register(username, password)).resolves.toEqual(true)
  })

  test('Login work', async () => {
    let accInst = new account.Account()
    let username = 'jestUser'
    let password = 'jestUser1'
    await expect(accInst.login(username, password)).resolves.toEqual(true)
  })
})

test('testing database connection local', () => {
  expect(db.getUsersList()).toBe('test')
})
