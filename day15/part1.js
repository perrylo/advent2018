const fs = require('fs')

let grid = fs.readFileSync('testdata1.txt', { encoding:'utf8' }).split('\n').map(l => l.split(''))

function printMap(){
  return grid.map(r => {
    return r.join('')+'\n'
  }).join('')
}

//console.log(printMap())

// get combatants
let combatants = []
for (let r=0; r<grid.length; ++r) {
  for (let c=0; c<grid[r].length; ++c) {
    if (grid[r][c] == "E" || grid[r][c] == "G") {
      combatants.push({
        id: `${grid[r][c]}${r}${c}`,
        type: grid[r][c],
        x: c,
        y: r,
        hp: 200,
        atk: 3
      })
    }
  }
}

// do ticks
let limiter = 0
let isOver = false
let elfCount = 0
let goblinCount = 0
combatants.map(c => {
  if (c.type == 'E') {
    ++elfCount
  } else {
    ++goblinCount
  }
})
//console.log(combatants)
//console.log(elfCount,'elves', goblinCount,'goblins')

while (!isOver && ++limiter<50) {
  // Sort combatants
  // Sort carts top-down, left-right
  combatants.sort(byReadingOrder)

  // Each combatant takes a turn: moves or attacks
  for (const c of combatants) {
    // First see if there enemies left
    if (!elfCount || !goblinCount) {
      isOver = true
      break
    }

    if (c.hp<1) {
      continue
    }

    const enemyType = c.type=='E' ? 'G' : 'E'

    // Move towards closest available enemy if none adjacent
    if (grid[c.y-1][c.x] != enemyType && grid[c.y+1][c.x] != enemyType && grid[c.y][c.x-1] != enemyType && grid[c.y][c.x+1] != enemyType) {
      // Find all accessible ranges
      const enemies = combatants.filter(e => e.type==enemyType && e.hp>0)
      let ranges = []
      for (const e of enemies) {
        //top
        if (grid[e.y-1][e.x] == '.' && hasClearPath(c,{x:e.x, y:e.y-1})) {
          ranges.push({x:e.x, y:e.y-1})
        }
        //bottom
        if (grid[e.y+1][e.x] == '.' && hasClearPath(c,{x:e.x, y:e.y+1})) {
          ranges.push({x:e.x, y:e.y+1})
        }
        //left
        if (grid[e.y][e.x-1] == '.' && hasClearPath(c,{x:e.x-1, y:e.y})) {
          ranges.push({x:e.x-1, y:e.y})
        }
        //right
        if (grid[e.y][e.x+1] == '.' && hasClearPath(c,{x:e.x+1, y:e.y})) {
          ranges.push({x:e.x+1, y:e.y})
        }
      }
      let shortest = 999
      ranges = ranges.map(r => {
        d = (Math.abs(c.x-r.x)+Math.abs(c.y-r.y))
        if (d<shortest) shortest = d
        return { x:r.x, y:r.y, d }
      })
      ranges = ranges.filter(r => r.d==shortest).sort(byReadingOrder)

      const chosenDest = ranges[0]
      if (chosenDest) {
        // Calc dist to chosenDest and move by reading order
        let stepOptions = []
        let shortestStep = 999
        let d
        //top
        if (grid[c.y-1][c.x]=='.' && hasClearPath({x:c.x, y:c.y-1}, chosenDest)) {
          d = (Math.abs(c.x-chosenDest.x)+Math.abs(c.y-1-chosenDest.y))
          if (d<shortestStep) shortestStep = d
          stepOptions.push({x:c.x, y:c.y-1, d})
        }
        //bottom
        if (grid[c.y+1][c.x]=='.' && hasClearPath({x:c.x, y:c.y+1}, chosenDest)) {
          d = (Math.abs(c.x-chosenDest.x)+Math.abs(c.y+1-chosenDest.y))
          if (d<shortestStep) shortestStep = d
          stepOptions.push({x:c.x, y:c.y+1, d})
        }
        //left
        if (grid[c.y][c.x-1]=='.' && hasClearPath({x:c.x-1, y:c.y}, chosenDest)) {
          d = (Math.abs(c.x-1-chosenDest.x)+Math.abs(c.y-chosenDest.y))
          if (d<shortestStep) shortestStep = d
          stepOptions.push({x:c.x-1, y:c.y, d})

        }
        //right
        if (grid[c.y][c.x+1]=='.' && hasClearPath({x:c.x+1, y:c.y}, chosenDest)) {
          d = (Math.abs(c.x+1-chosenDest.x)+Math.abs(c.y-chosenDest.y))
          if (d<shortestStep) shortestStep = d
          stepOptions.push({x:c.x+1, y:c.y, d})
        }

        stepOptions = stepOptions.filter(s=>s.d==shortestStep).sort(byReadingOrder)
        if (stepOptions[0]) {
          // do step
          grid[c.y][c.x] = '.'
          c.x = stepOptions[0].x
          c.y = stepOptions[0].y
          grid[c.y][c.x] = c.type
        }
      }
    }

    // Then attack adjacent enemy if possible

    // Identify adjacent enemies
    let adjEne = []
    let lowestAdjHP = 999
    //top
    if (grid[c.y-1][c.x] == enemyType) {
      adjEne.push({x:c.x, y:c.y-1})
    }
    //bottom
    if (grid[c.y+1][c.x] == enemyType) {
      adjEne.push({x:c.x, y:c.y+1})
    }
    //left
    if (grid[c.y][c.x-1] == enemyType) {
      adjEne.push({x:c.x-1, y:c.y})
    }
    //right
    if (grid[c.y][c.x+1] == enemyType) {
      adjEne.push({x:c.x+1, y:c.y})
    }
    adjEne.sort(byReadingOrder)

    if (adjEne[0]){
      // Attack
      targetIndex = combatants.findIndex(c => c.x==adjEne[0].x && c.y==adjEne[0].y && c.type==enemyType)
      combatants[targetIndex].hp -= c.atk
      if (combatants[targetIndex].hp <= 0) {
        grid[combatants[targetIndex].y][combatants[targetIndex].x] = '.'
        if (combatants[targetIndex].type == 'E') {
          elfCount--
        } else {
          goblinCount--
        }
      }
    }

  }

  //console.log(limiter)
  //console.log(printMap())

}

const finalRound = limiter -1
const remainingHP = combatants.reduce( (p,c) => { p + c.hp>0 ? c.hp:0 }, 0)
console.log(combatants)
console.log(finalRound, 'rounds')
console.log(finalRound*remainingHP)

function hasClearPath(from, to) {
  // x then y
  let isPathXYClear = true
  for (let x=from.x; x != to.x; x += (to.x-from.x)/Math.abs(to.x-from.x)) {
    if (x == from.x) continue
    //console.log('a', x, '-', from.y, ':', grid[from.y][x])
    if (grid[from.y][x] != '.') {
      isPathXYClear=false
      break
    }
  }
  for (let y=from.y; y != to.y; y += (to.y-from.y)/Math.abs(to.y-from.y)) {
    if (y == from.y) continue
    //console.log('b', to.x, '-', y, ':', grid[y][to.x])
    if (grid[y][to.x] != '.') {
      isPathXYClear=false
      break
    }
  }
  if (isPathXYClear) return true

  // y then x
  let isPathYCXlear = true
  for (let y=from.y; y != to.y; y += (to.y-from.y)/Math.abs(to.y-from.y)) {
    if (y == from.y) continue
    //console.log('c', from.x, '-', y, ':', grid[y][from.x])
    if (grid[y][from.x] != '.') {
      isPathYCXlear=false
      break
    }
  }
  for (let x=from.x; x != to.x; x += (to.x-from.x)/Math.abs(to.x-from.x)) {
    if (x == from.x) continue
    //console.log('d', x, '-', to.y, ':', grid[to.y][x])
    if (grid[to.y][x] != '.') {
      isPathYCXlear=false
      break
    }
  }
  if (isPathYCXlear) return true

  return false
}

function byReadingOrder(a,b) {
  if(a.y == b.y) {
    return (a.x < b.x) ? -1 : (a.x > b.x) ? 1 : 0;
  } else {
    return (a.y < b.y) ? -1 : 1;
  }
}