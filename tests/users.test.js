/* eslint-env jest */
const usersM = require.requireActual('../models/users')
const fs = require.requireActual('fs')
let userInst = new usersM.User()
let usersInst

beforeAll(() => {
  let dummyFile = {
    'user': [
      {
        'userData': 'testUser',
        'scoreData': 0,
        'streakData': 5,
        'date': '13/5/2018 15:39:27'
      }
    ]
  }
  if (!fs.existsSync('./mine')) {
    fs.mkdirSync('./mine')
    fs.writeFileSync('./mine/users_data.json', JSON.stringify(dummyFile, null, 4), 'utf8')
  }
  usersInst = new usersM.Users('./mine/users_data.json')
})

afterAll(() => {
  if (fs.existsSync('./mine') || fs.existsSync('./mine/users_data.json')) {
    fs.unlinkSync('./mine/users_data.json')
    fs.rmdirSync('./mine/')
  }
})

/**
 * If beforeEach is inside a describe block, it runs for each test in the describe block.
 */
beforeEach(() => {
  userInst = new usersM.User()
  usersInst = new usersM.Users('./mine/users_data.json')
})

/**
 * If afterEach is inside a describe block, it runs for each test in the describe block.
 */
afterEach(() => {
  userInst = undefined
  usersInst = undefined
})

describe('Testing class instances in users.js', () => {
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
    let usersInst = new usersM.Users('./mine/users_data.json').displayTopUsers()
    expect(/<[a-z/][\s\S]*>/i.test(usersInst)).toBeTruthy()
  })
})

describe('Users.loadUsers()', () => {
  it('should read file and return an object', () => {
    expect(usersInst.loadUsers()).toBeTruthy()
  })

  it('should create a file and return undefined', () => {
    fs.unlinkSync('./mine/users_data.json')
    expect(usersInst.loadUsers()).toBeFalsy()
  })
})
