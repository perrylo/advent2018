let circle = [0]
let currentIndex = 0
let playerIndex = 0

const numberOfPlayers = 493
const numberOfMarbles = 71863*100
//const numberOfPlayers = 9
//const numberOfMarbles = 25
const playerScores = new Array(numberOfPlayers)

for (let m=1; m<=numberOfMarbles; ++m) {
  //console.log('player', (m-1)%numberOfPlayers, 'gets marble', m)
  if (m % 23 != 0) {
    //place new marble
    let oneAhead = (currentIndex + 1) % circle.length
    let twoAhead = (currentIndex + 2) % circle.length

    if (twoAhead > oneAhead) {
      circle = [...circle.slice(0, oneAhead+1), m, ...circle.slice(twoAhead,circle.length)]
    } else {
      circle = [...circle.slice(0, oneAhead+1), m]
    }
    currentIndex = circle.indexOf(m)
  } else {
    // magic 23

    // add current marble to current player's score
    playerScores[(m-1)%numberOfPlayers] = playerScores[(m-1)%numberOfPlayers] ? playerScores[(m-1)%numberOfPlayers]+=m : m

    // find new current
    currentIndex -= 7
    if (currentIndex < 0) currentIndex = circle.length + currentIndex

    // remove current and add to player's score
    playerScores[(m-1)%numberOfPlayers] += circle[currentIndex]
    circle = [...circle.slice(0, currentIndex), ...circle.slice(currentIndex+1, circle.length)]

  }
}

//find winner
let topScore = 0
let topPlayer
for (let i=0; i<playerScores.length; ++i) {
  if (playerScores[i] > topScore) {
    topScore = playerScores[i]
    topPlayer = i
  }
}

console.log('player', topPlayer+1, 'won with score', topScore)

// 367802 too low
