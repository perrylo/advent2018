const fs = require('fs')

const rawdata = fs.readFileSync('data.txt', { encoding:'utf8' }).split('\n')
let data = rawdata.sort((a, b) => {
  const dateA = new Date(a.substr(1,16))
  const dateB = new Date(b.substr(1,16))
  return dateA > dateB ? 1 : -1
})

const guardSleepMinuteCount = {}
const guardSleepTotal = {}

let currentGuardId
let sleepStart
for (const logline of data) {
  if (logline.includes('Guard')) {
    reg = /#(\d+)/
    currentGuardId = logline.match(reg)[1]
    continue
  }

  if (logline.includes('asleep')) {
    reg = /00:(\d+)/
    sleepStart = parseInt(logline.match(reg)[1])
    continue
  }

  if (logline.includes('wakes')) {
    reg = /00:(\d+)/
    const sleepEnd = parseInt(logline.match(reg)[1])
    const sleepTime = sleepEnd - sleepStart


    //Update tallies
    if (!guardSleepMinuteCount[currentGuardId]) {
      guardSleepMinuteCount[currentGuardId] = {}
    }
    for (let i=sleepStart; i<sleepEnd; ++i){
      guardSleepMinuteCount[currentGuardId][i] = guardSleepMinuteCount[currentGuardId][i] ? guardSleepMinuteCount[currentGuardId][i]+1 : 1
    }

    guardSleepTotal[currentGuardId] = guardSleepTotal[currentGuardId] ? guardSleepTotal[currentGuardId]+sleepTime : sleepTime

    //Reset
    sleepStart = null
  }
}

// Get most consistent guard
let guardId
let guardMinute
let guardMinuteValue = 0

for (const guard of Object.keys(guardSleepMinuteCount)) {

  let sleepiestMinute
  let sleepiestMinuteValue
  for (const m of Object.keys(guardSleepMinuteCount[guard])) {
    if (!sleepiestMinute || guardSleepMinuteCount[guard][m] > guardSleepMinuteCount[guard][sleepiestMinute]) {
      sleepiestMinute = m
      sleepiestMinuteValue = guardSleepMinuteCount[guard][m]
    }
  }
  //console.log('guard', guard, 'sleepiest', sleepiestMinute, 'occurances', sleepiestMinuteValue)

  if (sleepiestMinuteValue > guardMinuteValue) {
    guardMinuteValue = sleepiestMinuteValue
    guardMinute = sleepiestMinute
    guardId = guard
  }
}

console.log(`Guard #${guardId} asleep at minute ${guardMinute} for ${guardMinuteValue} times.`)
console.log('magic number', parseInt(guardId)*parseInt(guardMinute))