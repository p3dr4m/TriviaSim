/* eslint-env jest */
const db = require('../models/database')
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

describe('executeQuery() tests', () => {
  test('test executeQuery with SELECT', async () => {
    await db.executeQuery('SELECT * FROM public."ACCOUNTS";').then(result => {
      expect(result).toBeTruthy()
    }).catch(error => {
      console.log(error)
    })
  })

  test('test executeQuery with empty string', async () => {
    await db.executeQuery('').then(result => {
      expect(result).toBeTruthy()
      console.log(result)
    }).catch(error => {
      console.log(error)
    })
  })

  test('test executeQuery with empty', async () => {
    await db.executeQuery('adsf').then(result => {
      expect(result).toBeTruthy()
    }).catch(error => {
      expect(error.message).toBe(`syntax error at or near \"adsf\"`)
    })
  })
})
