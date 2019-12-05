let currentMarble = addMarbleAfter(0)
const firstMarble = currentMarble

const numberOfPlayers = 493
const numberOfMarbles = 71863*100
const playerScores = {}

function addMarbleAfter(value, currentMarble) {
  const newMarble = { value }
  if (currentMarble) {
    newMarble.prev = currentMarble
    newMarble.next = currentMarble.next

    currentMarble.next.prev = newMarble
    currentMarble.next = newMarble
  } else {
    newMarble.prev = newMarble
    newMarble.next = newMarble
  }

  return newMarble
}


for (let m=1; m<=numberOfMarbles; ++m) {
  if (m%23==0) {
    // add current marble to current player's score
    playerScores[(m-1)%numberOfPlayers] = playerScores[(m-1)%numberOfPlayers] ? playerScores[(m-1)%numberOfPlayers]+=m : m

    // find new current and add to player's score
    currentMarble = currentMarble.prev.prev.prev.prev.prev.prev.prev
    playerScores[(m-1)%numberOfPlayers] += currentMarble.value

    // remove new current
    currentMarble = currentMarble.next
    currentMarble.prev = currentMarble.prev.prev
    currentMarble.prev.next = currentMarble

    //printList(m);
  } else {
    //console.log('current is', currentMarble.value, '\nadding', m, 'after', currentMarble.next.value)
    currentMarble = addMarbleAfter(m, currentMarble.next)
    //printList(m);
  }
}

console.log('winning score', Math.max(...Object.values(playerScores)))



function printList(l) {
  let c = firstMarble

  let n = ''
  for (let i=0; i<=l; ++i) {
    n += (c.value==currentMarble.value?'(':'')+c.value+(c.value==currentMarble.value?')':'')+' '
    c = c.next
  }
  console.log(n)
}
