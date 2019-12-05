const fs = require('fs')

// process map - make sure all lines are same length
let data = fs.readFileSync('data.txt', { encoding:'utf8' }).replace(/\\/g, 'q').split('\n')
const maxL = Math.max(...data.map(l => l.length))
data = data.map(l => l.padEnd(maxL, ' ')).map(r => r.split(''))

// get all carts, determine current orientation, and replace with map
let carts = []
for (let r=0; r<data.length; ++r) {
  for (let c=0; c<data[r].length; ++c) {
    const p = data[r][c]

    if (p == ">" || p == "<" || p == "^" || p == "v") {
      // remember cart
      cart = { id:''+r+c, x:c, y:r, dx:0, dy:0, nextInter:'turnLeft', isCrashed:false }
      if (p == ">") {
        cart.dx = 1
      }
      if (p == "<") {
        cart.dx = -1
      }
      if (p == "v") {
        cart.dy = 1
      }
      if (p == "^") {
        cart.dy = -1
      }
      carts.push(cart)

      // fix map - no carts start at an intersection or corner, good
      if (p == ">" || p == "<") {
        data[r][c] = '-'
      } else {
        data[r][c] = '|'
      }
    }
  }
}

//console.log(data.map(r => r.join('')))
//console.log('h', data.length, 'w', data[0].length)

// do ticks
let limiter = 0
let cartsLeft = carts.length
while (cartsLeft>1) {
  // Sort carts top-down, left-right
  carts.sort((a,b) => {
    if(a.y == b.y) {
      return (a.x < b.x) ? -1 : (a.x > b.x) ? 1 : 0;
    } else {
      return (a.y < b.y) ? -1 : 1;
    }
  })

  // Do moves and check for collisions
  for (const c of carts) {
    if (!c.isCrashed) {
      // Move cart
      c.x += c.dx
      c.y += c.dy

//console.log('id', c.id, 'x', c.x, 'y', c.y, 'dx', c.dx, 'dy', c.dy)
//console.log('p:', data[c.y][c.x])

      // See if cart hits intersection or corner
      if (data[c.y][c.x] == '/') {
        if (c.dx == 0){
          c.dx = c.dy>0 ? -1 : 1
          c.dy = 0
        } else {
          c.dy = c.dx>0 ? -1 : 1
          c.dx = 0
        }
      }
      if (data[c.y][c.x] == 'q') { // "\"
        if (c.dx == 0){
          c.dx = c.dy>0 ? 1 : -1
          c.dy = 0
        } else {
          c.dy = c.dx>0 ? 1 : -1
          c.dx = 0
        }
      }
      if (data[c.y][c.x] == '+') {
        if (c.nextInter == 'turnLeft'){
          if (c.dy == 0) {
            c.dy = c.dx>0 ? -1 : 1
            c.dx = 0
          } else {
            c.dx = c.dy>0 ? 1 : -1
            c.dy = 0
          }
          c.nextInter = 'goStraight'
        } else if (c.nextInter == 'goStraight'){
          // no dx/dy change
          c.nextInter = 'turnRight'
        } else if (c.nextInter == 'turnRight'){
          if (c.dy == 0) {
            c.dy = c.dx<0 ? -1 : 1
            c.dx = 0
          } else {
            c.dx = c.dy<0 ? 1 : -1
            c.dy = 0
          }
          c.nextInter = 'turnLeft'
        }
      }

      // check for crashes and redo alive cart count
      for (const d of carts) {
        if (c.id == d.id || c.isCrashed || d.isCrashed) {
          continue
        }
        if (c.x == d.x && c.y == d.y) {
          console.log('crashed at', c.x, c.y)
          c.isCrashed = true
          d.isCrashed = true

          cartsLeft = carts.reduce((p, c) => p += c.isCrashed?0:1 ,0)
          break
        }
      }
    }
  }

  //console.log(cartsLeft)

}

carts.map(c => {
  if (!c.isCrashed) {
    console.log('last cart', 'x', c.x, 'y', c.y)
  }
})

//console.log(carts.map(c => c.id))