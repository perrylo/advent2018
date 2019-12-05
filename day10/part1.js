const fs = require('fs')

const reg =/position=<(.+?),(.+?)> velocity=<(.+?),(.+?)>/
let data = fs.readFileSync('data.txt', { encoding:'utf8' }).split('\n').map(e => {
  const [_, x, y, dx, dy] = e.match(reg)
  return { x:parseInt(x), y:parseInt(y), dx:parseInt(dx), dy:parseInt(dy) }
})

// posit: message appears when there least entropy amongst data
// - print status when height is exactly 8, per sample
let limiter = 0
let isConverging = true
let width, height
while (isConverging && ++limiter<100000) {
  const _data = data.map(e => { return {
      x: e.x + e.dx,
      y: e.y + e.dy,
      dx: e.dx,
      dy: e.dy
    }
  })

  const _minX = Math.min(..._data.map(e => e.x))
  const _maxX = Math.max(..._data.map(e => e.x))
  const _minY = Math.min(..._data.map(e => e.y))
  const _maxY = Math.max(..._data.map(e => e.y))

  if (_maxY - _minY > height) {
    console.log(limiter)
    isConverging = false
  } else {
    data = _data
    width = _maxX - _minX
    height = _maxY - _minY
  }
}

const minX = Math.min(...data.map(e => e.x))
const maxX = Math.max(...data.map(e => e.x))
const minY = Math.min(...data.map(e => e.y))
const maxY = Math.max(...data.map(e => e.y))
//console.log(minX, maxX, minY, maxY)

//normalize
const normX = 0 - minX
const normY = 0 - minY
data = data.map(e => {
  return { x: e.x + normX, y: e.y + normY }
})

let grid = []
for (let r=0; r<=height; ++r) {
  grid[r] = []
  for (let c=0; c<=width; ++c) {
    grid[r][c] = '.'
  }
}

// draw points
data.map(e => {
  grid[e.y][e.x] = '#'
})
grid = grid.map(e => e.join(''))

console.log(grid)


