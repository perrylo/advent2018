const mySerial = 7857

// generate grid
const grid = []
for (let x=0; x<300; ++x){
  grid[x] = []
  const rackId = x + 11

  for (let y=0; y<300; ++y){
    let power = ((rackId * (y+1)) + mySerial) * rackId
    if (power >= 100) {
      power = parseInt((power.toString()).charAt(power.toString().length-3))
    } else {
      power = 0
    }
    power -= 5

    grid[x][y] = power

  }
}

// find most powerful 3x3
const sq = { x:0, y:0, p:0 }
for (let x=0; x<298; ++x) {
  for (let y=0; y<298; ++y) {
    let thisp = 0
    for (let r=0; r<3; ++r) {
      for (let c=0; c<3; ++c) {
        thisp += grid[x+r][y+c]
      }
    }

    if (thisp > sq.p) {
      sq.x = x
      sq.y = y
      sq.p = thisp
    }
  }
}

console.log(sq)