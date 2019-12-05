const fs = require('fs')

const data = fs.readFileSync('data.txt', { encoding:'utf8' }).split('\n')


// Determine prereqs and what steps there are
const prereqs = {}
const stepset = new Set()
const reg = /Step (\w) must be finished before step (\w) can begin./
data.map(l => {
  const [_, p, s] = l.match(reg)
  prereqs[s] = prereqs[s] ? prereqs[s]+p : p

  stepset.add(p)
  stepset.add(s)
})

// iterate through steps in alphabetical order to see if it prereqs have been met
let completed = ''
let limiter = 0
while(stepset.size && limiter++<100) {
  const steparr = Array.from(stepset).sort((a,b) => a>b ? 1 : -1)
  for (const step of steparr) {
    // For current step, see if its prereqs have been done
    let prereqsmet = true
    //console.log(step, 'prereq:', prereqs[step])
    for (const s of prereqs[step]||'') {
      prereqsmet = prereqsmet && completed.includes(s)
    }
    // if so, do step and start new round
    if (prereqsmet) {
      completed += step
      stepset.delete(step)
      break
    }
  }
}

console.log(completed)

