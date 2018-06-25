const opentdb = require('../models/opentdb')
const userQuestions = require('../models/userQuestions')
const pointPerQuestion = 500
const streakBonus = 200

/**
 * @class
 */
class Questions {
  /**
   * @summary Create an instance of a Questions
   * @name Questions
   * @class
   * @public
   *
   * @member {Object} this.questionsList - An array of questions
   * @member {Object} this.minimalQuestionsList - An array of questions with the
   * answer removed
   * @member {Number} this.currentQuestion - Variable that stores the current
   * question the quiz is on.
   *
   * @example
   * const quiz = new Questions()
   * quiz.getQuestions()
   */
  constructor () {
    this.questionsList = []
    this.minimalQuestionsList = []
    this.currentQuestion = 0
    this.categoryID = undefined
    this.difficultyID = undefined
    this.questionsListLength = 0
  }

  /**
   * @summary Gets a list of questions with the answer property removed.
   * Also, stores an array of questions with the answer kept on the backend
   * @method
   * @public
   *
   * @param amount - Amount of questions received from API
   * @param category - Quiz Category type
   * @param difficulty - Quiz difficulty
   * @param questionType - To determine if it is multiple choice type questions
   * or True/False type questions
   * @param sessionToken
   *
   * @returns {Promise<any>}
   * @resolves {Object} An object with only the question and it's choices
   *
   * @example
   * const quiz = new Questions()
   * quiz.getQuestions()
   */
  getQuestions (
    sessionToken,
    amount = 10,
    category = 15,
    difficulty = 'easy',
    questionType = 'multiple') {
    if (category.toString() !== '33') {
      return new Promise((resolve, reject) => {
        opentdb.getQuestions(
          sessionToken,
          amount,
          category,
          difficulty,
          questionType
        ).then((result) => {
          this.questionsList = result
          this.minimalQuestionsList = []
          for (let i = 0; i < this.questionsList.length; i++) {
            this.minimalQuestionsList.push({
              'index': i,
              'question': result[i].question,
              'option1': result[i].option1,
              'option2': result[i].option2,
              'option3': result[i].option3,
              'option4': result[i].option4
            })
          }
          this.categoryID = category
          if (difficulty === 'easy') {
            this.difficultyID = 1
          } else if (difficulty === 'medium') {
            this.difficultyID = 2
          } else if (difficulty === 'hard') {
            this.difficultyID = 3
          }
          this.questionsListLength = this.questionsList.length
          resolve(this.minimalQuestionsList)
        }).catch(error => {
          reject(error)
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        userQuestions.getRandomCustomQuiz(this).then((result) => {
          resolve(this.minimalQuestionsList)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }

  /**
   * @summary checks if user made the right choice by looking at the
   * @method
   * @public
   *
   * @param userObject - Object that contains current user's data including
   * username, score, streak, etc.
   * @param questionNumber - The current question to be assessed.
   * @param chosenAnswer - The choice made by the user for the current question.
   * @return {{result: boolean, currentUser: *}} Object dictating whether the
   * answer if right or wrong and the current user's data.
   *
   * @example
   * const quiz = new Questions()
   * let userObject = {
   * 'username': 'exampleName'
   * 'userID': 'idOfUser',
   * 'currentScore': {
   *    'userScore': 0,
   *    'currentStreak': 5,
   *    'highestStreak': 10
   *    }
   * quiz.assessQuestionResult(userObject, 5, 5)
   */
  assessQuestionResult (userObject, questionNumber, chosenAnswer) {
    let currentScore = userObject.currentScore
    if (this.questionsList[questionNumber].answers === Number(chosenAnswer)) {
      if (questionNumber >= 10){
        currentScore.userScore = currentScore.userScore * 2
      } else {
        currentScore.userScore +=
          pointPerQuestion + streakBonus * currentScore.currentStreak
        currentScore.currentStreak++
        if (currentScore.currentStreak > currentScore.highestStreak) {
          currentScore.highestStreak = currentScore.currentStreak
        }
      }
      return {
        'result': true,
        'currentUser': userObject.toJSON(),
        'answer': this.questionsList[questionNumber][`option${this.questionsList[questionNumber].answers}`]
      }
    } else {
      if (questionNumber >= 10) {
        userObject.currentScore.userScore = 0
      } else {
        userObject.currentScore.currentStreak = 0
      }
      return {
        'result': false,
        'currentUser': userObject.toJSON(),
        'answer': this.questionsList[questionNumber][`option${this.questionsList[questionNumber].answers}`]
      }
    }
  }

  /**
   * @summary Stores the quiz result for the user to ./models/users_data.json
   * @method
   * @public
   * @deprecated
   *
   * @param userObject - Object that holds user information for quiz
   *
   * @example
   * const quiz = new Questions()
   * quiz.storeQuizResult(userObject)
   */
  storeQuizResult (userObject) {
    let date = new Date()
    let timeStamp = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    return timeStamp
  }
}

/**
 * Exports the Questions Class
 * @type {{Questions: Questions}}
 */
module.exports = {
  Questions
}
