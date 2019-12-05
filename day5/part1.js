const fs = require('fs')

let data = fs.readFileSync('data.txt', { encoding:'utf8' })

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

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
console.log('final', data, data.length)