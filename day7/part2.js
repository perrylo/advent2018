const fs = require('fs')


const data = fs.readFileSync('data.txt', { encoding:'utf8' }).split('\n')
const solved = "ABGKCMVWYDEHFOPQUILSTNZRJX"
let jobs = "ABGKCMVWYDEHFOPQUILSTNZRJX"
const numberOfWorkers = 5
const timeMod = 60

//const data = fs.readFileSync('testdata.txt', { encoding:'utf8' }).split('\n')
//const solved = "CABFDE"
//let jobs = "CABFDE"
//const numberOfWorkers = 2
//const timeMod = 0

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const timeToComplete = {}
const _ = [...alphabet].map(l => {
  timeToComplete[l] = alphabet.lastIndexOf(l)+1+timeMod
})

// Determine prereqs and what steps there are
const prereqs = {}
const reg = /Step (\w) must be finished before step (\w) can begin./
data.map(l => {
  const [_, p, s] = l.match(reg)
  prereqs[s] = prereqs[s] ? prereqs[s]+p : p
})

const workers = []
let completed = ''
let limiter = 0
let ellapsed = 0
while(completed.length < solved.length && limiter++<1000) {
  // tick all works, busy and idle
  for (let w=0; w<numberOfWorkers; ++w) {
    if (workers[w]) {
      workers[w].count++

      // see if worker is done
      if (workers[w].count == timeToComplete[workers[w].step]) {
        completed += workers[w].step
        workers[w] = null
      }
    }
  }

  // Go through all remaining jobs and assign ready-to-be-worked-on jobs to free workers
  for (let w=0; w<numberOfWorkers; ++w) {
    // if worker is idle see if another job is available
    if (!workers[w]) {
      // For next job, see if its prereqs have been done
      for (const n of jobs) {
        let prereqsmet = true
        for (const s of prereqs[n]||'') {
          prereqsmet = prereqsmet && completed.includes(s)
        }

        if (prereqsmet) {
          workers[w] = { step:n, count:0 }
          jobs = jobs.replace(n, '')
          break;
        }
      }
    }
  }

  ellapsed++
  //console.log(ellapsed, completed, solved)
    console.log(
    ellapsed-1,
    workers[0]?workers[0].step:'.',
    workers[1]?workers[1].step:'.',
    workers[2]?workers[2].step:'.',
    workers[3]?workers[3].step:'.',
    workers[4]?workers[4].step:'.',
    completed)
}
console.log(ellapsed)
console.log(prereqs)

//899 too high
