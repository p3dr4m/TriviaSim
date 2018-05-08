const account = require('./models/account.js')

/**
 * @desc Import database library and assign users as constant.
 * @type {}
 */
const db = require('./models/database')
/**
 * @desc Import cookie-session module and assign cookieSession as constant
 * @type {Object}
 */
const cookieSession = require('cookie-session')
/**
 * @desc Import express module and assign express as constant.
 * @type {*|createApplication}
 */
const express = require('express')
/**
 * @desc Import hbs module and assign hbs as constant.
 * @type {Instance}
 */
const hbs = require('hbs')
/**
 * @desc Import bodyparser module to create middleware.
 * @type {Parsers|*}
 */
const bodyParser = require('body-parser')
/**
 * @desc Import lodash library and assign _ as constant.
 * @type {function(*): Object}
 * @private
 */
const _ = require('lodash')
/**
 * @desc Import user library and assign users as constant.
 * @type {{Users: Users, User: User}}
 */
const users = require('./models/users')
/**
 * @desc Import Question library and assign questions as constant.
 * @type {{Questions: Questions}}
 */
const questions = require('./controllers/questions')
/**
 * @desc Import environment variable port module and assign port equal to 8080.
 * @type {*|number}
 */
const port = process.env.PORT || 8080

let app = express()

let playingUsers = {}

hbs.registerPartials(`${__dirname}/views/partials`)

app.set('views', `${__dirname}/views`)
app.set('view engine', 'hbs')

app.use(cookieSession({
  name: 'session',
  keys: ['password'],
  maxAge: 24 * 60 * 60 * 1000
}))

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

hbs.registerHelper('dummy', () => {
  return undefined
})

/**
 * @desc Check if session is established
 */
app.use((request, response, next) => {
  if (request.session.id === undefined) {
    let date = new Date()
    request.session.id = date.getTime().toString()
  }
  next()
})

app.get('/', (request, response) => {
  response.render('index.hbs')
})

app.post('/storeuser', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    let userList = new users.Users()
    let userObject = playingUsers[sessionID].user
    userList.storeUser(userObject)
    delete playingUsers[sessionID]
    console.log(playingUsers)
    response.send('Quiz result stored successfully!')
  } else {
    response.send('Unable to store quiz result!')
  }
})

app.post('/loginWithoutAccount', (request, response) => {
  let sessionID = request.session.id.toString()
  let newUser = new users.User(request.body.username)
  playingUsers[sessionID] = {}
  playingUsers[sessionID].user = newUser
  response.send({
    'userObject': newUser
  })
})

/**
 * @desc Function sends get request to render leaderboards.hbs page, successful response renders the page
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.get('/leaderboard', (request, response) => {
  let userList = new users.Users()
  response.render('leaderboard.hbs', {
    list_of_user_data: userList.displayTopUsers()
  })
})

/**
 *
 */
app.post('/getquestions', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    let newQuestions = new questions.Questions()
    playingUsers[sessionID].questions = newQuestions
    newQuestions.getQuestions().then((result) => {
      response.send(result)
    })
  } else {
    response.send('Error')
  }
})

/**
 * @desc If user has session ID sends result object to the server, else sends 400 to indicate that an error occured
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.post('/validateanswer', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    let userObject = playingUsers[sessionID].user
    let questionsObject = playingUsers[sessionID].questions

    let result = questionsObject.assessQuestionResult(
      userObject,
      request.body.questionNumber,
      request.body.chosenAnswer
    )
    response.send(result)
  } else {
    response.send(400)
  }
})
/**
 * @desc Function sends get request to render about.hbs page, successful responce renders the page
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.get('/about', (request, response) => {
  response.render('about.hbs')
})

app.get('/signin', (request, response) => {
  response.render('signIn.hbs')
})

/**
 * @desc Renders Sign Up page
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.get('/signup', (request, response) => {
  response.render('signUp.hbs')
})

/**
 * @desc If requested page is not found function renders 404 error page
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.get('*', (request, response) => {
  response.render('404.hbs')
})

/**
 * @desc If username is valid sends true to the server, else false
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.post('/validateusername', (request, response) => {
  let userAccount = new account.Account()
  userAccount.validateUsername(request.body.USERNAME.toString()).then((result) => {
    if (result) {
      response.send(true)
    } else {
      response.send(false)
    }
  })
})

app.post('/validatepassword', (request, response) => {
  let userAccount = new account.Account()
  let result = userAccount.validatePassword(request.body.PASSWORD.toString())
  if (result) {
    response.send(true)
  } else {
    response.send(false)
  }
})

app.post('/register', (request, response) => {
  let USERNAME = request.body.USERNAME.toString()
  let PASSWORD = request.body.PASSWORD.toString()
  let CPASSWORD = request.body.CPASSWORD.toString()
  let userAccount = new account.Account()

  userAccount.validateUsername(USERNAME).then((result) => {
    if (result && userAccount.validatePassword(PASSWORD) && PASSWORD === CPASSWORD) {
      console.log('validation passed')
      userAccount.register(USERNAME, PASSWORD).then((finalResult) => {
        response.send(finalResult)
      })
    } else {
      response.send(false)
    }
  })
})

/**
 * @desc If the user exists logs him in 
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.post('/login', (request, response) => {
  let username = request.body.username
  let password = request.body.password
  let userAccount = new account.Account()
  userAccount.login(username, password).then((result) => {
    console.log(result)
    if (result) {
      let sessionID = request.session.id.toString()
      playingUsers[sessionID] = {}
      playingUsers[sessionID].user = userAccount
      response.send({
        'userObject': userAccount
      })
    }
  })
})

/**
 * @desc Function notifies port number of the local server
 */
app.listen(port, () => {
  console.log(`Server lis up on port 8080`)
})
