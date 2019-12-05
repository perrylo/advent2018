const fs = require('fs')

const rawdata = fs.readFileSync('data.txt', { encoding:'utf8' }).split('\n')
let data = rawdata.sort((a, b) => {
  const dateA = new Date(a.substr(1,16))
  const dateB = new Date(b.substr(1,16))
  return dateA > dateB ? 1 : -1
})

const guardDutyCount = {}
const guardSleepMinuteCount = {}
const guardSleepTotal = {}

let currentGuardId
let sleepStart
for (const logline of data) {
  if (logline.includes('Guard')) {
    reg = /#(\d+)/
    currentGuardId = logline.match(reg)[1]

    guardDutyCount[currentGuardId] = guardDutyCount[currentGuardId] ? guardDutyCount[currentGuardId]+1 : 1

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

// Get sleepiest guard
let sleepiestId
let sleepiestVal = 0
for (const k of Object.keys(guardSleepTotal)) {
  if (guardSleepTotal[k] > sleepiestVal ) {
    sleepiestVal = guardSleepTotal[k]
    sleepiestId = k
  }
}
console.log('sleepiest guard', sleepiestId)

// Get sleepiest minute
let sleepiestMinute
let sleepiestMinuteValue = 0
for (const k of Object.keys(guardSleepMinuteCount[sleepiestId])) {
  if (guardSleepMinuteCount[sleepiestId][k] > sleepiestMinuteValue) {
    sleepiestMinute = k
    sleepiestMinuteValue = guardSleepMinuteCount[sleepiestId][k]
  }
}
console.log('sleepiest minute', sleepiestMinute)

console.log('magic number', parseInt(sleepiestId)*parseInt(sleepiestMinute))