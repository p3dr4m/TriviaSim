const account = require('./models/account.js')
const userQuestions = require('./models/userQuestions')
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

/**
 * @desc playingUsers object contains sessionID objects that contain user account data, such as username, user id and current score
 * @type {Object}
 */
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

/**
 * @desc TBD
 */
app.post('/checkLoginStatus', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID) && playingUsers[sessionID].user.userID !== undefined) {
    response.send(playingUsers[sessionID].user.toJSON())
  } else {
    response.sendStatus(403)
  }
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
    if (result) {
      let sessionID = request.session.id.toString()
      playingUsers[sessionID] = {}
      playingUsers[sessionID].user = userAccount
      response.sendStatus(200)
    } else {
      response.sendStatus(406)
    }
  })
})

/**
 * @desc TBD
 */
app.post('/logout', (request, response) => {
  let sessionID = request.session.id.toString()
  delete playingUsers[sessionID]
  response.sendStatus(200)
})

app.post('/storeuser', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    if (playingUsers[sessionID].user !== undefined && playingUsers[sessionID].user.userID !== undefined) {
      playingUsers[sessionID].user.saveCurrentScore().then((result) => {
        response.sendStatus(201)
      }).catch((error) => {
        console.log(error)
        response.sendStatus(400)
      })
    } else {
      response.sendStatus(401)
    }
  } else {
    response.sendStatus(403)
  }
})

/**
 * @desc Function creates a new sessionID and a new User using the Account class, allowing users to play without an account.
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.post('/playAsGuest', (request, response) => {
  let sessionID = request.session.id.toString()
  let newUser = new account.Account(request.body.username)
  playingUsers[sessionID] = {}
  playingUsers[sessionID].user = newUser
  response.send(newUser.toJSON())
})

app.post('/play', (request, response) => {
  let sessionID = request.session.id.toString()
  response.send(playingUsers[sessionID].user.toJSON())
})

/**
 * @desc Function to start the game
 * @param {Object} request - Node.js request ob ject
 * @param {Object} response - Node.js response object
 */
app.post('/play', (request, response) => {
  let sessionID = request.session.id.toString()
  response.send(playingUsers[sessionID].user.toJSON())
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
 * @desc Function sends post request for the next question, responds with question object or a number indicating reason for a failure
 * @param {Object} request - Node.js request object contains session data
 * @param {Object} response - Node.js response object, responds with question object or a number indicating reason for a failure
 */
app.post('/getnextquestion', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    if (playingUsers[sessionID].questions !== undefined) {
      if (playingUsers[sessionID].questions.currentQuestion < 9) {
        playingUsers[sessionID].questions.currentQuestion++
        response.send(playingUsers[sessionID].questions.minimalquestionsList[playingUsers[sessionID].questions.currentQuestion])
      } else {
        delete playingUsers[sessionID].questions
        delete playingUsers[sessionID].user
        response.sendStatus(204)
      }
    } else {
      response.sendStatus(401)
    }
  } else {
    response.sendStatus(403)
  }
})

/**
 * @desc If user has session ID then create new question with chosen question type, else sends 500 to indicate that an interal server error occured.
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.post('/starttrivia', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    let newQuestions = new questions.Questions()
    playingUsers[sessionID].questions = newQuestions
    console.log(request.body.chosenType, request.body.chosenDiff)
    newQuestions.getQuestions(10, request.body.chosenType, request.body.chosenDiff).then((result) => {

      response.send(playingUsers[sessionID].questions.minimalquestionsList[playingUsers[sessionID].questions.currentQuestion])
    })
  } else {
    response.sendStatus(403)
  }
})

/**
 * @desc Function sends post request to the server, if user has session ID responds with result object, else responds with 400 to indicate that an error occured
 * @param {Object} request - Node.js request object contains session data
 * @param {Object} response - Node.js response object, responds with questionObject, or with 400 if error occured
 */
app.post('/validateanswer', (request, response) => {
  let sessionID = request.session.id.toString()
  if (Object.keys(playingUsers).includes(sessionID)) {
    let userObject = playingUsers[sessionID].user
    let questionsObject = playingUsers[sessionID].questions

    let result = questionsObject.assessQuestionResult(
      userObject,
      questionsObject.currentQuestion,
      request.body.chosenAnswer
    )
    response.send(result)
  } else {
    response.send(403)
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

/**
 * @desc Renders Sign Up page
 * @param {Object} request - Node.js request object
 * @param {Object} response - Node.js response object
 */
app.get('/register', (request, response) => {
  response.render('register.hbs')
})

app.get('/profile', (request, response) => {
  response.render('profile.hbs')
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
 * @desc Functions sends post request to the server containing username, if username is valid responds with true, else responds with false
 * @param {Object} request - Node.js request object, contains username
 * @param {Object} response - Node.js response object, responds with true if username is valid, else false
 */
app.post('/validateusername', (request, response) => {
  let userAccount = new account.Account()
  userAccount.validateUsername(request.body.USERNAME.toString()).then((result) => {
    if (result) {
      response.sendStatus(200)
    } else {
      response.sendStatus(406)
    }
  }).catch(error => {
    console.log(error)
  })
})

app.post('/validatepassword', (request, response) => {
  let userAccount = new account.Account()
  let result = userAccount.regexPassword(request.body.PASSWORD.toString())
  if (result) {
    response.sendStatus(200)
  } else {
    response.sendStatus(406)
  }
})

/**
 * @desc Function sends post request to register user, responds with true for success, else with false
 * @param {Object} request - Node.js request object contains account data
 * @param {Object} response - Node.js response object, responds with true for success, else with false
 */
app.post('/register', (request, response) => {
  let USERNAME = request.body.USERNAME.toString()
  let PASSWORD = request.body.PASSWORD.toString()
  let CPASSWORD = request.body.CPASSWORD.toString()
  let userAccount = new account.Account()

  userAccount.validateUsername(USERNAME).then((result) => {
    if (result && userAccount.regexPassword(PASSWORD) && PASSWORD === CPASSWORD) {
      console.log('validation passed')
      userAccount.register(USERNAME, PASSWORD).then((finalResult) => {
        response.send(finalResult)
      })
    } else {
      response.sendStatus(406)
    }
  }).catch(error => {
    if (error.message === 'Bad Username') {
      response.sendStatus(406)
    }
  })
})

app.post('/createQuestion', (request, response) => {
  let QUESTION_CONTENT = request.body.QUESTION_CONTENT.toString()
  let RIGHT_ANSWER = request.body.RIGHT_ANSWER.toString()
  let WRONG_ANSWER1 = request.body.WRONG_ANSWER1.toString()
  let WRONG_ANSWER2 = request.body.WRONG_ANSWER2.toString()
  let WRONG_ANSWER3 = request.body.WRONG_ANSWER3.toString()
  let session_id = request.session.id.toString()
  let user_id = playingUsers[session_id].user.userID

  userQuestions.createQuestion(QUESTION_CONTENT, RIGHT_ANSWER, WRONG_ANSWER1, WRONG_ANSWER2, WRONG_ANSWER3, user_id).then((result) => {
    if (result) {
      response.sendStatus(200)
    } else {
      response.sendStatus(406)
    }
  })
})

/**
 * @desc Function notifies port number of the local server
 */
app.listen(port, () => {
  console.log(`Server is up on port 8080`)
})
