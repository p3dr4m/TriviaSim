const db = require('./database')
const bcrypt = require('bcrypt')
const saltRounds = 10

class Account {
  constructor () {
    this.username = undefined
    this.password = undefined
    this.userID = undefined
  }

  /**
   * @desc [To be determined]
   * @returns {undefined}
   */
  login (username, password) {
    return new Promise((resolve, reject) => {
      db.executeQuery(`SELECT * FROM public."ACCOUNTS" WHERE "USERNAME" = '${username}';`).then((queryResult) => {
        let result = JSON.parse(queryResult)
        if (bcrypt.compareSync(password, result[0].PASSWORD)) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  encryptPassword (password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10).then((hash) => {
        resolve(hash)
      })
    })
  }

  /**
   * @desc [To be determined]
   * @returns {undefined}
   */
  register (username, password) {
    return new Promise((resolve, reject) => {
      this.encryptPassword(password).then((result) => {
        db.executeQuery(`INSERT INTO public."ACCOUNTS"("USERNAME", "PASSWORD") VALUES ('${username}', '${result}');`).then((result) => {
          console.log(result)
          resolve(result)
        })
      })
    })
  }

  validateUsername (USERNAME) {
    return new Promise((resolve, reject) => {
      db.executeQuery('SELECT "USERNAME" FROM "ACCOUNTS"').then((result) => {
        console.log(result)
        let userArray = JSON.parse(result)
        var found = userArray.some(function (el) {
          return el.USERNAME === USERNAME
        })
        resolve(!found)
      })
    })
  }

  validatePassword (pass) {
    var numbers = pass.match(/\d+/g)
    var uppers = pass.match(/[A-Z]/)
    var lowers = pass.match(/[a-z]/)
    var lengths = pass.length >= 6
    var valid = undefined

    if (numbers === null || uppers === null || lowers === null || lengths === false) valid = false

    if (numbers !== null && uppers !== null && lowers !== null && lengths) valid = true

    return valid
  }
}

module.exports = {
  Account
}
