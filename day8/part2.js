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
    metadata: [],
    value: 0
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

    if (node.header.childCount == 0) {
      node.value += m
    }
  }

  if (node.header.childCount != 0) {
    node.metadata.map(m => {
      if (node.childNodes[m-1]) {
        node.value += node.childNodes[m-1].value
      }
    })

  }

  return [node, arr]
}

const tree = convertToJSON(data)
//console.log(JSON.stringify(tree))
console.log(tree)
// 25648 too high