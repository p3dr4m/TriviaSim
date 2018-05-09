class Score {
  /**
   * This class holds the variables that construct the User Object.
   * @param userScore Score of the user
   * @param currentStreak Current streak the user has for the quiz
   * @param highestStreak Highest streak the user has for the quiz
   */
  constructor (userScore = 0, currentStreak = 0, highestStreak = 0) {
    this.userScore = userScore
    this.currentStreak = currentStreak
    this.highestStreak = highestStreak
  }

  toJSON () {
    return {
      'userScore': this.userScore,
      'currentStreak': this.currentStreak,
      'highestStreak': this.highestStreak
    }
  }
}

/**
 * exports Score class
 * @type {{Score: Score}}
 */
module.exports = {
  Score
}
