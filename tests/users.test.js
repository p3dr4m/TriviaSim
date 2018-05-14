/* eslint-env jest */
const usersM = require('../models/users')

beforeAll(() => {
  return undefined
})

afterAll(() => {
  // need to remove last element from users_data.json
});

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

describe('Users.displayTopUsers()', () => {
  it('should return html elements', () => {
    let usersInst = new usersM.Users()
    expect(/<[a-z/][\s\S]*>/i.test(usersInst.displayTopUsers())).toBeTruthy()
  })
})

describe('Users.loadUsers()', () => {
  let usersInst = new usersM.Users()
  const fs = require('fs')
  beforeEach(() => {
    if (!fs.existsSync('./mine')) {
      fs.mkdirSync('./mine')
    }
  })

  it('should read file and return an object', () => {
    expect(usersInst.loadUsers()).toBeTruthy()
  })

  afterAll(() => {
    if (fs.existsSync('./mine') || fs.existsSync('./mine/users_data.json')) {
      fs.unlinkSync('./mine/users_data.json')
      fs.rmdirSync('./mine/')
    }
  })

  it('should create a file and return undefined', () => {
    usersInst.fileName = './mine/users_data.json'
    expect(usersInst.loadUsers()).toBeFalsy()
  })
})
