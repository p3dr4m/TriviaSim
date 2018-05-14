const db = require('./database')

let createQuestion = (Q, CA, WA1, WA2, WA3, userID) => {
  return new Promise((resolve, reject) => {
    userID.toString()
    if (Q !== '' && CA !== '' && WA1 !== '' && WA2 !== '' && WA3 !== '' && userID !== '' && CA !== WA1 && CA !== WA2 && CA !== WA3) {
      db.executeQuery(`INSERT INTO public."QUESTIONS"(
      "QUESTION_CONTENT",
      "RIGHT_ANSWER",
      "WRONG_ANSWER1",
      "WRONG_ANSWER2",
      "WRONG_ANSWER3",
      "ACCOUNT_ID"
      ) VALUES (
      '${Q}',
      '${CA}',
      '${WA1}',
      '${WA2}',
      '${WA3}',
      '${userID}'
      );`).then((result) => {
        resolve(true)
      })
    } else {
      resolve(false)
    }
  })
}

module.exports = {
  createQuestion
}
