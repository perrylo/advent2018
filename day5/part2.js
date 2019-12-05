const fs = require('fs')

let poly = fs.readFileSync('data.txt', { encoding:'utf8' })

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

const removeMap = {}
for (const l of alphabet) {
  const reg = new RegExp(`${l}`, 'gi')
  const newpoly = poly.replace(reg, '')
  removeMap[l] = doReactions(newpoly)
}

let smallest
for (const v of Object.values(removeMap)) {
  if (!smallest || v<smallest) {
    smallest = v
  }
}
console.log(smallest)

function doReactions(data){
  let reacted = true
  while (reacted) {
    reacted = false
    for (const l of alphabet) {
      const reg1 = new RegExp(`${l}${l.toUpperCase()}`, 'g')
      newdata = data.replace(reg1, '')
      if (newdata !== data) {
        data = newdata
        reacted = true
      }

      const reg2 = new RegExp(`${l.toUpperCase()}${l}`, 'g')
      newdata = data.replace(reg2, '')
      if (newdata !== data) {
        data = newdata
        reacted = true
      }
    }
  }

  return data.length
}

