/* eslint-env jest */
const usersM = require('../models/users')

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

describe('Testing class instances in users.js', () => {
  const userInst = new usersM.User()
  const usersInst = new usersM.Users()

  it('creates new User instance with valid parameters', () => {
    expect(typeof userInst.username).toBe('string')
    expect(typeof userInst.userScore).toBe('number')
    expect(typeof userInst.currentStreak).toBe('number')
    expect(typeof userInst.highestStreak).toBe('number')
  })

  it('creates new Users instance with valid parameters', () => {
    expect(typeof usersInst.fileName).toBe('string')
    expect(typeof usersInst.userList).toBe('object')
  })

  it('checks if the user was stored in the database', () => {
    usersInst.storeUser(userInst)
    expect(usersInst.userList.user[usersInst.userList.user.length - 1].userData).toEqual(userInst.username)
  })
})
