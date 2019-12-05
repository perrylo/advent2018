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

// find most powerful n x n
const sq = { x:0, y:0, s:0, p:0 }
for (let s=0; s<=300; ++s) {
  for (let x=0; x<300-s; ++x) {
    for (let y=0; y<300-s; ++y) {
      let thisp = 0
      for (let r=0; r<s; ++r) {
        for (let c=0; c<s; ++c) {
          thisp += grid[x+r][y+c]
        }
      }

      if (thisp > sq.p) {
        sq.x = x
        sq.y = y
        sq.p = thisp
        sq.s = s
      }
    }
  }

}


console.log(sq)