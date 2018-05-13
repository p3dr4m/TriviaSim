const fs = require('fs')
const db = require('./database')
/**
 * @class Users
 * @classdesc This is the Users Class
 * @param {string} filename - the path of a file to which you want to write users' info into.
 * @param {list} userList - a list contains all user names.
 * @param {object} object - the object that contains all users' info.
 */
class Users {
  /**
   * @constructor {string} this.fileName
   * @param fileName
   */
  constructor (fileName = './models/users_data.json') {
    this.fileName = fileName
    this.userList = []
    this.userList = this.loadUsers()
  }

  /**
   * @desc loadUsers loads the user data from the database, if there is no file it will be created.
   * @returns {object} It will return the users_data.json as an object if the file exists
   */
  loadUsers () {
    if (fs.existsSync(this.fileName)) {
      return JSON.parse(fs.readFileSync(this.fileName))
    } else {
      let object = {
        'user': []
      }
      fs.writeFileSync(this.fileName, JSON.stringify(object, null, 4), 'utf8')
    }
  };

  /**
   * @deprecated
    * It's a function that saves users' info into a file.
    */
  saveUsers () {
    fs.writeFileSync(this.fileName, JSON.stringify(this.userList, null, 4), 'utf8')
  };

  /**
   * @deprecated we're going to use a database
   * storeUser stores user data to a file.
   * @param {object} userObject - The current user's username.
   */
  storeUser (userObject) {
    let date = new Date()
    let timeStamp = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

    this.userList.user.push({
      userData: userObject.username,
      scoreData: userObject.userScore,
      streakData: userObject.highestStreak,
      date: timeStamp
    })
    this.saveUsers()
  };

  /**
   * @desc Sort user information with sortOption as keyword.
   * @param {string} sortOption - keyword for sorting
   * @return {array} sorted object contains user information
   */
  sortScores (sortOption) {
    let userInfo = this.userList.user.slice(0)
    userInfo.sort((a, b) => {
      return b[sortOption] - a[sortOption]
    })
    return userInfo
  };

  /**
   * @desc Display top 10 users with their rank, user name, highest streak and scores.
   * @return string string contains rank, user name, highest streak and scores of a user.
   */
  displayTopUsers () {
    let newSort = this.sortScores('scoreData')
    let displayString = ''
    let rankCounter = 1
    for (let i = 0; i < newSort.length; i++) {
      displayString += '<div class="scoreDisplayRow">\n\t'

      displayString += '<div class="leaderboardDisplayColumn">\n'
      displayString += `<p class="displayInfo"> ${rankCounter} </p>\n`
      displayString += '</div>\n'

      displayString += '<div class="leaderboardDisplayColumn">\n'
      displayString += `<p class="displayInfo"> ${newSort[i].userData} </p>\n`
      displayString += '</div>\n'

      displayString += '<div class="leaderboardDisplayColumn">\n'
      displayString += `<p class="displayInfo"> ${newSort[i].streakData} </p>\n`
      displayString += '</div>\n'

      displayString += '<div class="leaderboardDisplayColumn">\n'
      displayString += `<p class="displayInfo"> ${newSort[i].scoreData} </p>\n`
      displayString += '</div>\n'

      displayString += '<div class="leaderboardDisplayColumn">\n'
      displayString += `<p class="displayInfo"> ${newSort[i].date} </p>\n`
      displayString += '</div>\n</div>\n'

      if (rankCounter >= 10) {
        break
      }
      rankCounter++
    }

    return displayString
  };
}

/**
 * @class
 */
class User {
  /**
   * This class holds the variables that construct the User Object.
   * @param username Name of the user
   * @param userScore Score of the user
   * @param currentStreak Current streak the user has for the quiz
   * @param highestStreak Highest streak the user has for the quiz
   */
  constructor (username = 'testUser', userScore = 0, currentStreak = 5, highestStreak = 5) {
    this.username = username
    this.userScore = userScore
    this.currentStreak = currentStreak
    this.highestStreak = highestStreak
  }
}

/**
 * exports User class and Users class
 * @type {{Users: Users, User: User}}
 */
module.exports = {
  Users,
  User
}
