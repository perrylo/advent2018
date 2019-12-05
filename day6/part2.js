const fs = require('fs')

let smallestX, largestX, smallestY, largestY
let data = fs
            .readFileSync('data.txt', { encoding:'utf8' })
            .split('\n')
            .map(e => {
              const [x,y] = e.split(',').map(n => parseInt(n))
              if (!smallestX || x<smallestX) {
                smallestX = x
              }
              if (!smallestY || y<smallestY) {
                smallestY = y
              }
              if (!largestX || x>largestX) {
                largestX = x
              }
              if (!largestY || y>largestY) {
                largestY = y
              }

              return { x, y }
            })

/*
console.log(data)
console.log('smallestX', smallestX)
console.log('largestX', largestX)
console.log('smallestY', smallestY)
console.log('largestY', largestY)
*/

const grid = [...Array(largestX)].map(e => Array(largestY))
const pointCount = {}

// For all points inside boundary determine closest point(s)
// |x1 - x2| + |y1 - y2|
let c = 0
for (let x=smallestX; x<largestX; ++x) {
  for (let y=smallestY; y<largestY; ++y) {
    let tempdistmap = {}
    for (let i=0; i<data.length; ++i) {
      const mandist = Math.abs(x-data[i].x) + Math.abs(y-data[i].y)
      tempdistmap[i] = mandist
    }

    const disttot = Object.values(tempdistmap).reduce((p,c) => p+c, 0)
    if (disttot < 10000) c++
  }
}
console.log(c)


