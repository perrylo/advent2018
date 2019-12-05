const fs = require('fs')

const data = fs.readFileSync('data.txt', { encoding:'utf8' }).split(' ').map(e => parseInt(e))

let metatotal = 0

// Convert data to json
function convertToJSON(arr) {
  const node = {
    header: {
      childCount: arr.shift(),
      metaCount: arr.shift()
    },
    childNodes: [],
    metadata: []
  }
  for (let i=0; i<node.header.childCount; ++i) {
    const [n, a] = convertToJSON(arr)
    node.childNodes.push(n)
    arr = a
  }

  for (let i=0; i<node.header.metaCount; ++i) {
    const m = arr.shift()
    node.metadata.push(m)
    metatotal += m
  }

  return [node, arr]
}

const tree = convertToJSON(data)

console.log('meta total', metatotal)