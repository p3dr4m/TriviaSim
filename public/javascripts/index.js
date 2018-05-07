// Page elements:
let questionViewWrap = document.getElementById('questionViewWrap')
let userInfo = document.getElementById('userInfo')
let questionNumber = document.getElementById('questionNumber')
let questionContent = document.getElementById('questionContent')
let greetBox = document.getElementById('greetBox')
let answer1 = document.getElementById('answer1')
let answer2 = document.getElementById('answer2')
let answer3 = document.getElementById('answer3')
let answer4 = document.getElementById('answer4')
let userName = document.getElementById('greetBoxUsernameInput')
let popupWrap = document.getElementById('popupWrap')
let popupMessageUsername = document.getElementById('popupMessageUsername')
let popupMessageScore = document.getElementById('popupMessageScore')
let popupMessageStreak = document.getElementById('popupMessageStreak')
let notification = document.getElementById('notify')
let notifyTitle = document.getElementById('notify_title')
let notifyWrap = document.getElementById('wrap')



let currentQuestion = 0
let questionList = []
let sessionCode = ''
let userObject = {}

let assessQuestionResult = (chosenAnswer) => {
  let xmlhttp = new XMLHttpRequest()
  xmlhttp.open('POST', '/validateanswer', true)
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      let xmlhttpResult = JSON.parse(xmlhttp.responseText)
      userObject = xmlhttpResult.currentUser
      if (xmlhttpResult.result === true) {
        displayNotification('right')
      } else {
        displayNotification('wrong')
      }
      populatePopupResult()
    }
  }
  xmlhttp.send(`sessioncode=${sessionCode}&questionNumber=${currentQuestion}&chosenAnswer=${chosenAnswer}`)
}

let storeQuizResult = () => {
  questionViewWrap.style.top = '-100vh'
  let xmlhttp = new XMLHttpRequest()
  xmlhttp.open('POST', '/storeuser', true)
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      console.log(xmlhttp.responseText)
    }
  }
  xmlhttp.send(`sessioncode=${sessionCode}`)
  notifyWrap.style.display = 'block'
  notification.style.right = '0'
  setTimeout(() => {
    notification.style.right = '-100%'
    popupWrap.style.top = '50vh'
    setTimeout(() => {
      notifyWrap.style.display = 'none'
    }, 300)
  }, 1200)
}

/**
 *
 * @param {number} - ????
 */
let playWithoutLoggingIn = (event = 1) => {
  if (event === 1 || event.keyCode === 13) {
    if (userName.value !== '') {
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.open('POST', '/loginWithoutAccount', true)
      xmlhttp.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
      )
      xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          notifyTitle.innerHTML = `Welcome ${userName.value}`
          document.getElementById('tooltip').style.backgroundImage = 'url(/assets/images/icons/puzzle.svg)'
          let responseText = JSON.parse(xmlhttp.responseText)
          sessionCode = responseText.sessionCode
          userObject = responseText.userObject
          fetchQuestions()
        }
      }
      xmlhttp.send(`username=${userName.value}`)
    } else {
      swal('Error!', 'You left the username blank!', 'warning')
    }
  }
}

/**
 * @desc Displays the current user's name to the popup message Username along with their current Score and Highest Streak
 *
 */
let populatePopupResult = () => {
  popupMessageUsername.innerHTML = userObject.username
  popupMessageScore.innerHTML = `SCORE: ${userObject.userScore}`
  popupMessageStreak.innerHTML = `HIGHEST STREAK: ${userObject.highestStreak}`
}
/**
 * @desc function displays the next question or the result when the game is over
 */
let nextQuestion = () => {
  if (currentQuestion < 9) {
    currentQuestion++
    displayQuestion()
  } else {
    storeQuizResult()
  }
}

/**
 * @desc Opens new HTTP request and looks for POST "/getquestions", if there is a state change, then it will parse into a JSON object which is displayed back to the user in the greet Box which only shows for 0.3 seconds then dissapears
 *
 */
let fetchQuestions = () => {
  let xmlhttp = new XMLHttpRequest()
  xmlhttp.open('POST', '/getquestions', true)
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      questionList = JSON.parse(xmlhttp.responseText)
      displayQuestion()
      greetBox.style.opacity = '0'
      setTimeout(() => {
        greetBox.style.display = 'none'
      }, 300)
    }
  }
  xmlhttp.send(`sessioncode=${sessionCode}`)
}
/**
 * @desc Displays a game question
 */
let displayQuestion = () => {
  notifyWrap.style.display = 'block'
  questionViewWrap.style.top = '-100vh'
  setTimeout(() => {
    notification.style.right = '0'
  }, 1)
  setTimeout(() => {
    userInfo.innerHTML = `${userObject.username} - ${userObject.userScore}`
    questionNumber.innerHTML = 'QUESTION ' + (currentQuestion + 1)
    questionContent.innerHTML = questionList[currentQuestion].question
    answer1.innerHTML = questionList[currentQuestion].option1
    answer2.innerHTML = questionList[currentQuestion].option2
    answer3.innerHTML = questionList[currentQuestion].option3
    answer4.innerHTML = questionList[currentQuestion].option4
    questionViewWrap.style.top = '45vh'
    notification.style.right = '-100%'
    setTimeout(() => {
      notifyWrap.style.display = 'none'
    }, 300)
  }, 1200)
}

/**
 * @desc Displays a pop up notifying if the answer was right or wrong
 * @param {string} mode - refers to user answer right/wrong
 */
let displayNotification = (mode) => {
  let thumbUp = 'url(/assets/images/icons/thumb-up.svg)'
  let thumbDown = 'url(/assets/images/icons/dislike.svg)'

  if (mode === 'wrong') {
    notifyTitle.innerHTML = 'Wrong! :('
    document.getElementById('tooltip').style.backgroundImage = thumbDown
  } else if (mode === 'right') {
    notifyTitle.innerHTML = 'Good Job! :)'
    document.getElementById('tooltip').style.backgroundImage = thumbUp
  }
}





