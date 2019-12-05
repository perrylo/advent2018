const fs = require('fs')

let data = fs.readFileSync('data.txt', { encoding:'utf8' }).split('\n')

function makePot(number, hasPlant, current, isAfter) {
  const pot = { number, hasPlant, nextGenPlant:false }
  if (current) {
    if (isAfter) {
      current.next = pot
      pot.prev = current
    } else {
      current.prev = pot
      pot.next = current
    }
  }
  return pot
}

function printPots(current) {
  let str = ''
  while(current) {
    str += current.hasPlant ? '#' : '.'
    current = current.next
  }
  return str
}

function getPotByIndex(i){
  let p = pot0
  while (p && p.number != i) {
    if (i>0) {
      p = p.next
    } else {
      p = p.prev
    }
  }
  return p
}



// Get initial state
const pots = data.shift().split(': ')[1]
const pot0 = makePot(0, pots.charAt(0)=='#')
let current = pot0
for (let i=1; i<pots.length; ++i) {
  current = makePot(i, pots.charAt(i)=='#', current, true)
}


// rework instructions
data.shift()
const transformMap = {}
data.map(e => {
  let [start, end] = e.split(' => ')
  transformMap[start] = end
})


// 20 generations
let leftmostPlantSoFar = 0
let rightmostPlantSoFar = pots.lastIndexOf('#')
for (let gen=0; gen<20; ++gen) {
console.log(gen, printPots(getPotByIndex(leftmostPlantSoFar)))

  // go through the patterns
  for (const key of Object.keys(transformMap)) {

    // start 1 pot left of leftmost plant
    let start = getPotByIndex(leftmostPlantSoFar)
    start = start.prev || makePot(leftmostPlantSoFar-1, false, start, false)

    let current = start
    let cont = true
    while (cont) {
      const lpot = current.prev || {}
      const llpot = lpot.prev || {}
      const rpot = current.next || {}
      const rrpot = rpot.next || {}

      const testPattern = `${llpot.hasPlant?'#':'.'}${lpot.hasPlant?'#':'.'}${current.hasPlant?'#':'.'}${rpot.hasPlant?'#':'.'}${rrpot.hasPlant?'#':'.'}`
      if (testPattern == key) {
        current.nextGenPlant = transformMap[key] == '#' ? true : false
      }

      // break if we see 4 empty pots on the right of rightmost plant
      if ((current.number == undefined || current.number > rightmostPlantSoFar) && !lpot.hasPlant && !current.hasPlant && !rpot.hasPlant && !rrpot.hasPlant) {
        cont = false
      } else {
        current = current.next || makePot(current.number+1, false, current, true)
      }
    }
  }

  // Update pots
  let c = getPotByIndex(leftmostPlantSoFar)
  while (c.prev) {
    c = c.prev
  }
  while (c) {
    c.hasPlant = c.nextGenPlant ? true : false

    if (c.hasPlant && c.number < leftmostPlantSoFar) {
      leftmostPlantSoFar = c.number
    }
    if (c.hasPlant && c.number > rightmostPlantSoFar) {
      rightmostPlantSoFar = c.number
    }

    c = c.next
  }

}

//console.log('final', printPots(getPotByIndex(leftmostPlantSoFar)))

//add up pot numbers
let c = getPotByIndex(leftmostPlantSoFar)
while (c.prev) {
  c = c.prev
}
let t = 0
while (c) {
  t += c.hasPlant ? c.number : 0
  c = c.next
}
console.log('total', t)



//1582 too low
//2094 too low